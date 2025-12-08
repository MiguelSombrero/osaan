import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Welcome to Osaan
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your competence profiles and track your skills
        </p>

        <div className="space-y-4">
          <Link
            href="/competences"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Manage Competences
          </Link>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Features
            </h2>
            <ul className="text-left text-gray-600 space-y-2">
              <li>✓ Browse available skills</li>
              <li>✓ Create competence profiles</li>
              <li>✓ Track skill ratings (1-5)</li>
              <li>✓ Integration with microservices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
