use serde::{Deserialize, Serialize};
use std::env;
use std::io::{BufRead, BufReader, Read};
use std::process::{Command, Stdio};
use tauri::Emitter;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadSettingsState {
    destination: Option<String>,
    file_name: Option<String>,
    video_format: Option<String>,
    audio_format: Option<String>,
    output_format: String,
}

#[tauri::command]
pub fn start_download(window: tauri::Window, url: String, settings: DownloadSettingsState) {
    std::thread::spawn(move || {
        let args = get_arguments(&settings, &url);

        let mut child = Command::new("yt-dlp")
            .args(args.clone())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .expect("Failed to start yt-dlp");

        if let Some(stdout) = child.stdout.take() {
            let mut reader = BufReader::new(stdout);
            let mut buffer = [0; 1024]; // Read in chunks of 1024 bytes

            while let Ok(bytes_read) = reader.read(&mut buffer) {
                if bytes_read == 0 {
                    break; // EOF
                }

                let chunk = String::from_utf8_lossy(&buffer[..bytes_read]);
                if chunk.starts_with('\r') {
                    let mut chunk = chunk[1..].to_string();
                    chunk.push('\n');
                    window.emit("yt-dlp-output", &chunk.to_string()).unwrap();
                } else {
                    window.emit("yt-dlp-output", &chunk.to_string()).unwrap();
                }
            }
        }

        if let Some(stderr) = child.stderr.take() {
            let reader = BufReader::new(stderr);
            for line in reader.lines() {
                if let Ok(line) = line {
                    window.emit("yt-dlp-error", line).unwrap();
                }
            }
        }

        match child.wait() {
            Ok(_) => {
                window.emit("yt-dlp-output", "end").unwrap();
            }
            Err(e) => {
                window.emit("yt-dlp-error", e.to_string()).unwrap();
            }
        }
    });
}

fn get_arguments(state: &DownloadSettingsState, url: &String) -> Vec<String> {
    vec![
        url.to_string(),
        "-f".to_string(),
        get_format(&state.video_format, &state.audio_format),
        "--merge-output-format".to_string(),
        state.output_format.clone(),
        "-o".to_string(),
        format!(
            "{}/{}",
            get_directory(&state.destination),
            get_file_name(&state.file_name)
        ),
    ]
}

fn get_directory(destination: &Option<String>) -> String {
    destination
        .clone()
        .unwrap_or(env::current_dir().unwrap().to_string_lossy().to_string())
}

fn get_file_name(file_name: &Option<String>) -> String {
    file_name.clone().unwrap_or("%(title)s.%(ext)s".to_string())
}

fn get_format(video_format: &Option<String>, audio_format: &Option<String>) -> String {
    match (video_format, audio_format) {
        (Some(video), Some(audio)) => format!("{}+{}", video, audio),
        _ => "bv+ba/b".to_string(),
    }
}

#[tauri::command]
pub fn retrieve_video_data(window: tauri::Window, url: String) {
    std::thread::spawn(move || {
        let mut child = Command::new("yt-dlp")
            .args([&url, "-J"])
            .stdout(Stdio::piped())
            .spawn()
            .expect("Failed to start yt-dlp");

        if let Some(stdout) = child.stdout.take() {
            let mut reader = BufReader::new(stdout);
            let mut output = String::new();

            reader
                .read_to_string(&mut output)
                .expect("Failed to read stdout");

            window.emit("yt-dlp-video-data", output).unwrap();
        }
    });
}
