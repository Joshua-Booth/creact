import "@testing-library/cypress/add-commands";
import "@cypress/code-coverage/support";
import "./commands";
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";

installLogsCollector();
