import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { analyzePrivacyPolicy } from '../utils/aiService';
import DetailsCard from '../components/AirQualityCard';
import './Dashboard.css';
import axios from "axios";

const SARVAM_TRANSLATE_ENDPOINT = "https://api.sarvam.ai/translate";
const SARVAM_TTS_ENDPOINT = "https://api.sarvam.ai/text-to-speech";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [aiImpact, setImpact] = useState('');
  const [aiUser, setAiUser] = useState('');
  const [score, setScore] = useState(0);
  const [policyFile, setPolicyFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [translatedSummary, setTranslatedSummary] = useState('You have to translate the Summary first.');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const [getText, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resumePosition, setResumePosition] = useState(0);
  const [policyUrl, setPolicyUrl] = useState("");
  const chunkAudioRefs = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const currentAudioRef = useRef(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [isDecodingAudio, setIsDecodingAudio] = useState(false);

  const handleUrlFetch = async () => {
  if (!policyUrl.trim()) {
    setError("Please enter a valid URL.");
    return;
  }
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(policyUrl);
    const text = response.data;

    const { summary, safetyScore, impact, userImpact } =
      await analyzePrivacyPolicy(text);

    setScore(safetyScore);
    setAiSummary(summary);
    setImpact(impact);
    setAiUser(userImpact);

    const txt = `Impact: ${impact}, Takeaways: ${userImpact}, Summary: ${summary}`;
    setText(txt);
    setFileName(`Fetched from URL: ${policyUrl}`);
  } catch (err) {
    console.error("URL Fetch Error:", err);
    setError("Failed to fetch policy from URL. Try again.");
  } finally {
    setLoading(false);
  }
};
  
  function splitText(text, maxChars = 300) {
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [];
    const chunks = [];
    let current = '';
    for (let sentence of sentences) {
      if ((current + sentence).length <= maxChars) {
        current += sentence;
      } else {
        if (current) chunks.push(current);
        current = sentence;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }

  const playMessageAudio = async (text, resume = false) => {
    setIsDecodingAudio(true);
    setIsSpeaking(true);

    if (!resume) {
      chunkAudioRefs.current = [];
      currentChunkIndexRef.current = 0;
    }

    if (chunkAudioRefs.current.length === 0) {
      const chunks = splitText(text, 300);
      for (const chunk of chunks) {
        try {
          const response = await axios.post(SARVAM_TTS_ENDPOINT, {
            text: chunk,
            target_language_code: language,
            speaker: "hitesh",
            pitch: 0.1,
            pace: speed,
            loudness: 0.9,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: "bulbul:v2"
          }, {
            headers: {
              "api-subscription-key": process.env.REACT_APP_SARVAM_API,
              "Content-Type": "application/json"
            }
          });

          const base64Audio = response.data.audios?.[0];
          if (!base64Audio) continue;

          const byteArray = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
          const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);

          chunkAudioRefs.current.push(audio);
        } catch (err) {
          console.error("TTS Error:", err);
        }
      }
    }

    const playChunks = (index) => {
      const chunks = chunkAudioRefs.current;
      if (!chunks || index >= chunks.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        setResumePosition(0);
        currentAudioRef.current = null;
        return;
      }

      const audio = chunks[index];
      currentAudioRef.current = audio;

      audio.onended = () => {
        currentChunkIndexRef.current = index + 1;
        playChunks(index + 1);
      };

      audio.onerror = () => {
        console.error("Audio playback error in chunk", index);
        playChunks(index + 1);
      };

      audio.play();
    };

    playChunks(currentChunkIndexRef.current);
    setIsDecodingAudio(false);
  };

  const togglePlayPause = (text) => {
    if (isSpeaking && !isPaused) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        setPausedTime(currentAudioRef.current.currentTime);
      }
      setIsPaused(true);
    } else if (isPaused) {
      if (currentAudioRef.current) {
        currentAudioRef.current.currentTime = pausedTime;
        currentAudioRef.current.play();
      }
      setIsPaused(false);
    } else {
      setPausedTime(0);
      playMessageAudio(text, false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPolicyFile(file);
      setFileName(file.name.toLowerCase());
    }
  };

  const handleAnalyzePolicy = async () => {
    if (!policyFile) {
      setError('Please upload a privacy policy file.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const text = await policyFile.text();
      const { summary, safetyScore, impact, userImpact } = await analyzePrivacyPolicy(text);

      setScore(safetyScore);
      setAiSummary(summary);
      setImpact(impact);
      setAiUser(userImpact);
      const txt = `Impact: ${impact}, Takeaways: ${userImpact}, Summary: ${summary}`;
      setText(txt);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError('Failed to analyze policy. Try again.');
    } finally {
      setLoading(false);
    }
  };

  function splitForTranslate(text, maxChars = 1000) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + maxChars));
      start += maxChars;
    }
    return chunks;
  }

  const handleTranslate = async () => {
    if (!getText) return;
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(SARVAM_TRANSLATE_ENDPOINT, {
          input: getText,
          source_language_code: "en-IN",
          target_language_code: language,
          mode: "formal",
          model: "sarvam-translate:v1",
          numerals_format: "native",
          speaker_gender: "Male",
          enable_preprocessing: false
        }, {
          headers: {
            "api-subscription-key": process.env.REACT_APP_SARVAM_API,
            "Content-Type": "application/json"
          }
        });
      setTranslatedSummary(response.data.translated_text);

// ✅ Clear old audio when translation changes
chunkAudioRefs.current = [];
currentChunkIndexRef.current = 0;
currentAudioRef.current = null;
setIsSpeaking(false);
setIsPaused(false);

    }catch (error) {
      console.error("Translation Error:", error.response?.data || error.message);
      setError("Translation failed. Try again.");
    }
    setLoading(false);
  };

  const handleTextToSpeech = () => {
    let textToRead = translatedSummary !== 'You have to translate the Summary first.' ? translatedSummary : getText;
    if (!textToRead || textToRead.trim() === '') {
      console.error("No text available for speech.");
      return;
    }
    togglePlayPause(textToRead);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleSearchPolicy = async () => {
    setLoading(true);
    setError(null);
    try {
      let { data, error } = await supabase
        .from('privacy_policies')
        .select('*')
        .ilike('company_name', `%${searchQuery.toLowerCase()}%`);

      if (error) throw error;

      if (data.length > 0) {
        const policy = data[0];

        setAiSummary(policy.summary);
        setAiUser(policy.userimpact);
        setImpact(policy.impact);
        setScore(policy.safety_score);

        const txt = `Impact: ${policy.impact}, Takeaways: ${policy.userimpact}, Summary: ${policy.summary}`;
        setText(txt);
      } else {
        setError('No matching privacy policy found.');
      }
    } catch (err) {
      console.error("Search Error:", err);
      setError("Error fetching policies. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <motion.div
        className="policy-upload-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Upload or Search Privacy Policy</h3>

        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a company's privacy policy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
          <motion.button className="search-button" onClick={handleSearchPolicy}>
            Search
          </motion.button>
        </div>

        {fileName && <motion.p className="file-name">{fileName}</motion.p>}

        <motion.div
  className="file-url-upload-wrapper"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* URL Input */}
  <motion.input
    type="text"
    className="url-input"
    placeholder="Enter privacy policy URL..."
    value={policyUrl}
    onChange={(e) => setPolicyUrl(e.target.value)}
    whileFocus={{ scale: 1.02, borderColor: "#3399ff" }}
  />

  {/* Fetch Button */}
  <motion.button
    className="url-fetch-button"
    onClick={handleUrlFetch}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Fetch
  </motion.button>

  {/* File Upload */}
  <input
    type="file"
    accept=".txt,.pdf,.docx"
    ref={fileInputRef}
    onChange={handleFileUpload}
    style={{ display: "none" }}
  />
  <motion.label
    className="file-upload-label"
    onClick={() => fileInputRef.current.click()}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Choose File
  </motion.label>
</motion.div>


        <motion.button className="analyze-button" onClick={handleAnalyzePolicy}>
          Analyze Policy
        </motion.button>
      </motion.div>

      <div className="ai-summary-section">
        <h3>AI Policy Analysis</h3>
        {aiSummary && (
          <>
            <p><strong>Impact:</strong> {aiImpact}</p>
            <p><strong>Takeaways:</strong> {aiUser}</p>
            <p><strong>Summary:</strong> {aiSummary}</p>

            {/* Language Dropdown */}
            <select 
  className="language-select" 
  onChange={(e) => setLanguage(e.target.value)} 
  value={language}
>
  <option value="en-IN">English</option>
  <option value="hi-IN">Hindi</option>
  <option value="bn-IN">Bengali</option>
  <option value="gu-IN">Gujarati</option>
  <option value="kn-IN">Kannada</option>
  <option value="ml-IN">Malayalam</option>
  <option value="mr-IN">Marathi</option>
  <option value="od-IN">Odia</option>
  <option value="pa-IN">Punjabi</option>
  <option value="ta-IN">Tamil</option>
  <option value="te-IN">Telugu</option>
{/* 
  <option value="as-IN">Assamese</option>
  <option value="brx-IN">Bodo</option>
  <option value="doi-IN">Dogri</option>
  <option value="kok-IN">Konkani</option>
  <option value="ks-IN">Kashmiri</option>
  <option value="mai-IN">Maithili</option>
  <option value="mni-IN">Manipuri (Meiteilon)</option>
  <option value="ne-IN">Nepali</option>
  <option value="sa-IN">Sanskrit</option>
  <option value="sat-IN">Santali</option>
  <option value="sd-IN">Sindhi</option>
  <option value="ur-IN">Urdu</option> */}
</select>


            <motion.button className="translate-button" onClick={handleTranslate}>Translate</motion.button>

            <div className="audio-player">
  <button className="play-pause-button" onClick={handleTextToSpeech}>
    {isSpeaking ? (isPaused ? '▶️' : '⏸️') : '▶️'}
  </button>

  <div className="speed-control">
    <span className="speed-label">Speed: {speed.toFixed(1)}x</span>
    <input
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      value={speed}
      onChange={handleSpeedChange}
      className="speed-slider"
    />
  </div>
</div>

          </>
        )}
        <hr />
        <h3>Translated Result</h3> {translatedSummary}
      </div>

      <div className="air-quality-container">
        <DetailsCard data={score} />
      </div>
    </div>
  );
};

export default Dashboard;

