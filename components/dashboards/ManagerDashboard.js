export default function ManagerDashboard({ user }) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p>Welcome, Manager {user.name}!</p>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Management Tools</h2>
          <ul className="list-disc pl-5">
            <li>View team performance</li>
            <li>Assign tasks</li>
            <li>Generate reports</li>
          </ul>
        </div>
      </div>
    )
  }
  
  