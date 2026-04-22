// Power BI JavaScript SDK initialization
const powerbi = window.powerbi;

// Configuration for each report (replace with actual values)
const reportsConfig = [
  {
    containerId: "reportContainer1",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_1",
    accessToken: "YOUR_ACCESS_TOKEN_1"
  },
  {
    containerId: "reportContainer2",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_2",
    accessToken: "YOUR_ACCESS_TOKEN_2"
  },
  // Add configurations for the remaining 6 reports
  {
    containerId: "reportContainer3",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_3",
    accessToken: "YOUR_ACCESS_TOKEN_3"
  },
  {
    containerId: "reportContainer4",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_4",
    accessToken: "YOUR_ACCESS_TOKEN_4"
  },
  {
    containerId: "reportContainer5",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_5",
    accessToken: "YOUR_ACCESS_TOKEN_5"
  },
  {
    containerId: "reportContainer6",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_6",
    accessToken: "YOUR_ACCESS_TOKEN_6"
  },
  {
    containerId: "reportContainer7",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_7",
    accessToken: "YOUR_ACCESS_TOKEN_7"
  },
  {
    containerId: "reportContainer8",
    embedUrl: "https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID_8",
    accessToken: "YOUR_ACCESS_TOKEN_8"
  }
];

// Function to embed a report
function embedReport(config) {
  const embedConfig = {
    type: "report",
    tokenType: powerbi.models.TokenType.Embed,
    accessToken: config.accessToken,
    embedUrl: config.embedUrl,
    id: config.reportId, // If you have report ID
    permissions: powerbi.models.Permissions.All,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: false
        }
      }
    }
  };

  const reportContainer = document.getElementById(config.containerId);
  powerbi.embed(reportContainer, embedConfig);
}

// Embed all reports
reportsConfig.forEach(embedReport);

// Note: To get actual embed URLs and access tokens, you need to:
// 1. Register an app in Azure AD
// 2. Get access tokens via Power BI REST API
// 3. Use server-side code to securely handle tokens
// This is a basic example; in production, fetch tokens from your server.