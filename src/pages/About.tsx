export default function About() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          About HexPI
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              People Intelligence Platform
            </h2>
            <p className="text-gray-700 mb-4">
              HexPI (Hex People Intelligence) is a comprehensive platform designed to provide
              detailed insights into organizations and their affiliated personnel. Our advanced
              search capabilities allow you to quickly discover information about companies,
              their structure, and key individuals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Organization Search:</strong> Find detailed information about companies,
                including their industry, location, founding date, and website.
              </li>
              <li>
                <strong>Affiliate Search:</strong> Discover key personnel, their roles,
                contact information, and organizational affiliations.
              </li>
              <li>
                <strong>Fast & Efficient:</strong> Our optimized search algorithms deliver
                results quickly and accurately.
              </li>
              <li>
                <strong>Comprehensive Data:</strong> Access a wide range of information to
                support your research and intelligence needs.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology</h2>
            <p className="text-gray-700 mb-4">
              HexPI is built with modern web technologies to ensure a fast, responsive, and
              reliable user experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Frontend:</strong> React with TypeScript, Vite, and Tailwind CSS
              </li>
              <li>
                <strong>Backend:</strong> FastAPI (Python) for high-performance API endpoints
              </li>
              <li>
                <strong>Architecture:</strong> RESTful API design with pagination support
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700">
              For questions, feedback, or support, please reach out to our team at{' '}
              <a
                href="mailto:support@hexpi.com"
                className="text-primary-600 hover:underline"
              >
                support@hexpi.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
