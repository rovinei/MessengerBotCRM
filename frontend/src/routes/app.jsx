import Dashboard from '../views/Dashboard/Dashboard';
import UserProfile from '../views/UserProfile/UserProfile';
import TableList from '../views/TableList/TableList';
import Typography from '../views/Typography/Typography';
import Icons from '../views/Icons/Icons';
import Maps from '../views/Maps/Maps';
import Notifications from '../views/Notifications/Notifications';
import MessengerBot from '../views/MessengerBot';

const appRoutes = [
    { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/bots", name: "Messenger Bot", icon: "pe-7s-smile", component: MessengerBot },
    { path: "/table", name: "Conversation Flow", icon: "pe-7s-chat", component: TableList },
    { path: "/typography", name: "Promotion", icon: "pe-7s-rocket", component: Typography },
    { path: "/user", name: "Customer", icon: "pe-7s-users", component: UserProfile },
    // { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
    // { path: "/maps", name: "Maps", icon: "pe-7s-map-marker", component: Maps },
    // { path: "/notifications", name: "Notifications", icon: "pe-7s-bell", component: Notifications },
    { redirect: true, path:"/", to:"/dashboard", name: "Dashboard" }
];

export default appRoutes;
