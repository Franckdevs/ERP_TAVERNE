import "./DashboardAdmin.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import StatCards from "./components/StatCards/StatCards";
import SalesChart from "./components/SalesChart/SalesChart";
import ExpensesDonut from "./components/ExpensesDonut/ExpensesDonut";
import ProjectsTracking from "./components/ProjectsTracking/ProjectsTracking";
import TeamsProductivity from "./components/TeamsProductivity/TeamsProductivity";

export default function DashboardAdmin({
  onLogout,
}: {
  onLogout?: () => void;
}) {
  return (
    <div className="dash">
      <Sidebar onLogout={onLogout} />

      <div className="dash__main">
        <Topbar />

        <main className="dash__content">
          <StatCards />

          <div className="dash__row dash__row--charts">
            <SalesChart />
            <ExpensesDonut />
          </div>

          <div className="dash__row dash__row--bottom">
            <ProjectsTracking />
            <TeamsProductivity />
          </div>
        </main>
      </div>
    </div>
  );
}