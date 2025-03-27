import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { analyzePrivacyPolicy } from '../utils/aiService';
import DetailsCard from '../components/AirQualityCard';
import './Dashboard.css';

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
  const [language, setLanguage] = useState('en');
  const [translatedSummary, setTranslatedSummary] = useState('You have to translate the Summary first.');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);
  const [getText, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resumePosition, setResumePosition] = useState(0);
  const speechRef = useRef(null);
  const voicesRef = useRef([]);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  
    // Load available voices for speech synthesis
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
  
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  
    // Reset spoken part when page reloads
    const utterance = new SpeechSynthesisUtterance(' ');
    setResumePosition(0);
    setIsSpeaking(false);
    setIsPaused(false);
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

      await supabase.from('privacy_policies').insert([
        { company_name: fileName, policy_text: text, summary, impact, userimpact: userImpact, safety_score: safetyScore }
      ]);
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError('Failed to analyze policy. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!getText) return;
    setLoading(true);
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(getText)}`);
      const data = await response.json();
      setTranslatedSummary(data[0].map(item => item[0]).join(' '));
    } catch (error) {
      console.error("Translation Error:", error);
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
  
    // **Handle Pause & Resume**
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }
  
    // **Stop any previous speech before starting new one**
    window.speechSynthesis.cancel();
    setResumePosition(0);
    setIsSpeaking(false);
    setIsPaused(false);
  
    // Get available voices and match with the selected language
    const availableVoices = voicesRef.current;
    let selectedVoice = availableVoices.find(voice => voice.lang.startsWith(language)) || availableVoices.find(voice => voice.lang.startsWith("en"));
    
    if (!selectedVoice) {
      console.error("No suitable voice found for the selected language.");
      return;
    }
  
    // Start new speech
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speed;
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
  
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setResumePosition(0);
    };
  
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleSearchPolicy = async () => {
    setLoading(true);
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

        <motion.div className="file-upload-wrapper">
          <input type="file" accept=".txt,.pdf,.docx" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <motion.label className="file-upload-label" onClick={() => fileInputRef.current.click()}>
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
            <select className="language-select" onChange={(e) => setLanguage(e.target.value)} value={language}>
              <option value="en">English</option>
              {/* <option value="hi">Hindi</option> */}
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
            <motion.button className="translate-button" onClick={handleTranslate}>Translate</motion.button>
            <div className="audio-player">
              <button className="play-pause-button" onClick={handleTextToSpeech}>
                {isSpeaking ? (isPaused ? '▶️' : '⏸️') : '▶️'}
              </button>
              <label>Speed: {speed}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={handleSpeedChange} className='speed-button' />
            </div>
          </>
        )}
        <hr/>
        <h3>Translated Result</h3> {translatedSummary}
      </div>

      <div className="air-quality-container">
        <DetailsCard data={score} />
      </div>
    </div>
  );
};

export default Dashboard;
