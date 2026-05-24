import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/App.css";
import ExpandIcon from "./assets/drop-down-icon-thick.svg";
import { useNavigate } from "react-router-dom";
import { DatewisePage } from "./DatewisePage";

const API_URL = "https://backend-vryp.onrender.com/api/users";

export function DashBoard() {
  const navigate = useNavigate();
  const [content, setContent] = useState("Dashboard");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const [selectedAnalyticsFilter, setSelectedAnalyticsFilter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FILTER STATES =================

  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState([]);

  // ================= ANALYTICS =================

  const [analytics, setAnalytics] = useState({
    active: 0,
    readyToDeploy: 0,
    done: 0,
    critical: 0,
  });

  const handleAnalyticsFilter = (type) => {
    if (selectedAnalyticsFilter === type) {
      setSelectedAnalyticsFilter(null);

      return;
    }

    setSelectedAnalyticsFilter(type);
  };

  // ================= OPTIONS =================

  const statusOptions = [
    "Done",
    "Ready to Deploy",
    "In Progress",
    "Test",
    "Rejected",
    "On Hold",
  ];

  const priorityOptions = ["Highest", "High", "Medium", "Low"];

  const assigneeOptions = [
    "Ambiga Anandraj",
    "Jayakumar Udayakumar",
    "Martin Hambalek",
    "Burt Silverman",
    "Kishor Amirthalingam",
  ];

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (selectedStatus.length > 0) {
        params.status = selectedStatus;
      }

      if (selectedPriority.length > 0) {
        params.priority = selectedPriority;
      }

      if (selectedAssignee.length > 0) {
        params.assignee = selectedAssignee;
      }
      const res = await axios.get(API_URL, {
        params,
      });

      setFilteredTickets(res.data.tickets);

      setAnalytics(res.data.analytics);
    } catch (error) {
      setError("Failed to load tickets. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO REFRESH ON FILTER CHANGE =================

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedPriority, selectedAssignee]);

  // ================= HANDLE CHECKBOX =================

  const handleCheckboxChange = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((item) => item !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  // ================= FILTER TABLE FROM ANALYTICS =================

  useEffect(() => {
    if (!selectedAnalyticsFilter) {
      fetchTickets();
      return;
    }

    let filtered = [...filteredTickets];

    switch (selectedAnalyticsFilter) {
      case "active":
        filtered = filtered.filter((ticket) =>
          ["In Progress", "Test", "On Hold"].includes(ticket.Status),
        );

        break;

      case "readyToDeploy":
        filtered = filtered.filter(
          (ticket) => ticket.Status === "Ready to Deploy",
        );

        break;

      case "done":
        filtered = filtered.filter((ticket) => ticket.Status === "Done");

        break;

      case "critical": {
        filtered = filtered.filter((ticket) => ticket.Priority === "High");

        break;
      }

      default:
        break;
    }

    setFilteredTickets(filtered);
  }, [selectedAnalyticsFilter]);

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedPriority([]);
    setSelectedAssignee([]);
  };

  // ================= EXPAND ROW =================

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="main-container">
      {/* ================= HEADER ================= */}

      <div className="top-header">
        <h1 className="app-title">DeliveryIQ</h1>

      </div>

      {/* ================= NAVBAR ================= */}

      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className={
              "nav-button " + (content === "Dashboard" ? "active-nav" : "")
            }
            onClick={() => setContent("Dashboard")}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>

          <button
            className={
              "nav-button " + (content === "DateWise" ? "active-nav" : "")
            }
            onClick={() => setContent("DateWise")}
          >
            <span className="nav-icon">📈</span>
            Datewise Summary
          </button>
        </div>

        <div className="navbar-right">
          <div className="project-selector">
            <select className="project-dropdown">
              <option>Lovevery</option>
              <option>Project Alpha</option>
              <option>Project Beta</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= PAGEDahboard ================= */}
      {content === "Dashboard" && (
        <div>
          <div className="page-heading-container">
            <h2 className="page-heading">Tickets Dashboard</h2>
          </div>

          <div>
            {/* ================= ANALYTICS ================= */}

            <div className="analysis-section">
              <div
                className={`analysis-card active-card ${
                  selectedAnalyticsFilter === "active"
                    ? "selected-analysis-card"
                    : ""
                }`}
                onClick={() => handleAnalyticsFilter("active")}
              >
                <div className="analysis-title">Active</div>

                <div className="analysis-value">{analytics.active}</div>
              </div>

              <div
                className={`analysis-card deploy-card ${
                  selectedAnalyticsFilter === "readyToDeploy"
                    ? "selected-analysis-card"
                    : ""
                }`}
                onClick={() => handleAnalyticsFilter("readyToDeploy")}
              >
                <div className="analysis-title">Ready to Deploy</div>

                <div className="analysis-value">{analytics.readyToDeploy}</div>
              </div>

              <div
                className={`analysis-card done-card ${
                  selectedAnalyticsFilter === "done"
                    ? "selected-analysis-card"
                    : ""
                }`}
                onClick={() => handleAnalyticsFilter("done")}
              >
                <div className="analysis-title">Done</div>

                <div className="analysis-value">{analytics.done}</div>
              </div>

              <div
                className={`analysis-card critical-card ${
                  selectedAnalyticsFilter === "critical"
                    ? "selected-analysis-card"
                    : ""
                }`}
                onClick={() => handleAnalyticsFilter("critical")}
              >
                <div className="analysis-title">Critical</div>

                <div className="analysis-value">{analytics.critical}</div>
              </div>
            </div>

            {/* ================= TABLE SECTION ================= */}

            <div className="ticket-section">
              <div className="ticket-header">
                <div className="header-content">
                  <h3 className="ticket-heading">Ticket Details</h3>
                </div>

                <div className="header-buttons">
                  <div className="Days">*Last 30 days</div>

                  {/* <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button> */}

                  <button
                    className="refresh-btn"
                    onClick={clearFilters}
                    title="Refresh tickets"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* ================= FILTER SECTION ================= */}

              <div className="filter-section">
                {/* ================= STATUS ================= */}

                <div className="filter-item">
                  <label className="filter-label">Status</label>

                  <details className="multi-select-dropdown">
                    <summary className="dropdown-summary">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {selectedStatus.length > 0
                            ? `${selectedStatus.length} Selected`
                            : "Select Status"}
                        </span>

                        <img
                          src={ExpandIcon}
                          alt="arrow"
                          className="dropdown-arrow"
                        />
                      </div>
                    </summary>

                    <div className="dropdown-options">
                      {statusOptions.map((status, index) => (
                        <label className="dropdown-option" key={index}>
                          <input
                            type="checkbox"
                            checked={selectedStatus.includes(status)}
                            onChange={() =>
                              handleCheckboxChange(
                                status,
                                selectedStatus,
                                setSelectedStatus,
                              )
                            }
                          />

                          <span>{status}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>

                {/* ================= PRIORITY ================= */}

                <div className="filter-item">
                  <label className="filter-label">Priority</label>

                  <details className="multi-select-dropdown">
                    <summary className="dropdown-summary">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {selectedPriority.length > 0
                          ? `${selectedPriority.length} Selected`
                          : "Select Priority"}

                        <img
                          src={ExpandIcon}
                          alt="arrow"
                          className="dropdown-arrow"
                        />
                      </div>
                    </summary>

                    <div className="dropdown-options">
                      {priorityOptions.map((priority, index) => (
                        <label className="dropdown-option" key={index}>
                          <input
                            type="checkbox"
                            checked={selectedPriority.includes(priority)}
                            onChange={() =>
                              handleCheckboxChange(
                                priority,
                                selectedPriority,
                                setSelectedPriority,
                              )
                            }
                          />

                          <span>{priority}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>

                {/* ================= ASSIGNEE ================= */}

                <div className="filter-item">
                  <label className="filter-label">Assignee</label>

                  <details className="multi-select-dropdown">
                    <summary className="dropdown-summary">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {selectedAssignee.length > 0
                          ? `${selectedAssignee.length} Selected`
                          : "Select Assignee"}
                        <img
                          src={ExpandIcon}
                          alt="arrow"
                          className="dropdown-arrow"
                        />
                      </div>
                    </summary>

                    <div className="dropdown-options">
                      {assigneeOptions.map((assignee, index) => (
                        <label className="dropdown-option" key={index}>
                          <input
                            type="checkbox"
                            checked={selectedAssignee.includes(assignee)}
                            onChange={() =>
                              handleCheckboxChange(
                                assignee,
                                selectedAssignee,
                                setSelectedAssignee,
                              )
                            }
                          />

                          <span>{assignee}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>
              </div>

              {/* ================= TABLE ================= */}

              <div className="table-container">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>

                    <p>Loading tickets...</p>
                  </div>
                ) : error ? (
                  <div className="error-state">
                    <p>❌ {error}</p>

                    <button onClick={fetchTickets} className="retry-btn">
                      Retry
                    </button>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="empty-state">
                    <p>📭 No tickets found</p>

                    <p className="empty-subtitle">Try adjusting your filters</p>
                  </div>
                ) : (
                  <table className="ticket-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="expand-column"></th>
                        <th>Ticket ID</th>
                        <th>Summary</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Assignee</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTickets.map((ticket, index) => (
                        <React.Fragment key={index}>
                          <tr
                            className="table-data-row"
                            onClick={() => toggleRow(index)}
                          >
                            {/* ================= EXPAND ICON ================= */}

                            <td className="expand-icon-cell">
                              <div
                                className={`expand-icon ${
                                  expandedRow === index ? "expanded" : ""
                                }`}
                              >
                                <img
                                  src={ExpandIcon}
                                  alt="expand"
                                  className="expand-svg"
                                />
                              </div>
                            </td>

                            <td className="ticket-id-cell">
                              {ticket["Ticket_ID"]}
                            </td>

                            <td className="summary-cell">
                              {ticket["Summary"]}
                            </td>

                            <td className="status-cell">
                              <span
                                className={`status-badge status-${ticket[
                                  "Status"
                                ]
                                  ?.toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                {ticket["Status"]}
                              </span>
                            </td>

                            <td className="priority-cell">
                              <span
                                className={`priority-badge priority-${ticket[
                                  "Priority"
                                ]?.toLowerCase()}`}
                              >
                                {ticket["Priority"]}
                              </span>
                            </td>

                            <td className="assignee-cell">
                              <span className="assignee-badge">
                                {ticket["Assignee"]}
                              </span>
                            </td>

                            <td className="updated-cell">
                              {new Date(
                                ticket["Last_Updated"],
                              ).toLocaleDateString()}
                            </td>
                          </tr>

                          {/* ================= EXPANDED ROW ================= */}

                          <tr
                            className={`expanded-row ${
                              expandedRow === index
                                ? "expanded-visible"
                                : "expanded-hidden"
                            }`}
                          >
                            <td colSpan="7" className="expanded-content-cell">
                              <div
                                className={`expanded-content ${
                                  expandedRow === index
                                    ? "expanded-content-open"
                                    : ""
                                }`}
                              >
                                <div className="expanded-item">
                                  <div className="expanded-label">
                                    Latest Comment
                                  </div>

                                  <div className="expanded-value">
                                    {ticket["Latest_Comment"] ||
                                      "No comments yet"}
                                  </div>
                                </div>

                                <div className="expanded-item">
                                  <div className="expanded-label">
                                    AI Summary
                                  </div>

                                  <div className="expanded-value">
                                    {ticket["AI_Summary"] ||
                                      "No summary available"}
                                  </div>
                                </div>

                                <div className="expanded-item">
                                  <div className="expanded-label">
                                    Created Date
                                  </div>

                                  <div className="expanded-value">
                                    {ticket["Created_Date"]
                                      ? new Date(
                                          ticket["Created_Date"],
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {content === "DateWise" && <DatewisePage />}
    </div>
  );
}
