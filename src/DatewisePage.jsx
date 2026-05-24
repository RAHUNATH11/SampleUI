import { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Datewise.css";

const API_URL = "http://127.0.0.1:5000/api/datewise";

export const DatewisePage = ({ onBack }) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTimelineData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load timeline data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading timeline...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-state">
        <p>❌ {error}</p>
        <button onClick={fetchTimeline} className="retry-btn">
          Retry
        </button>
      </div>
    );

  return (
    <div className="datewise-container">
      <div className="page-header">
        <h1>AI Daily Ticket Updates</h1>
        <button className="back-btn" onClick={onBack}>
          Back To Dashboard
        </button>
      </div>

      <div className="month-title">
        {timelineData.length > 0
          ? new Date(timelineData[0].Date)
              .toLocaleString("default", { month: "long" })
              .toUpperCase()
          : "UPDATES"}
      </div>

      <div className="timeline-container">
        {timelineData.map((item, idx) => {
          const { day, year } = formatDate(item.Date); // <-- changed to item.Date
          const isLast = idx === timelineData.length - 1;
          return (
            <div className="timeline-item" key={idx}>
              <div className="timeline-date">
                <div className="day">{day}</div>
                <div className="year">{year}</div>
              </div>
              <div className="timeline-line">
                <div className="circle"></div>
                {!isLast && <div className="line"></div>}
              </div>
              <div className="timeline-content">
                <h3>Daily AI Summary</h3>
                {/* Split by newline if needed, otherwise just display */}
                {item.AI_Summary.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
