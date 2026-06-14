

// export default function Contact() {
//   return (
//     <>
//       <main className="p-8">
//         <h1 className="text-3xl font-bold">Contact Page</h1>
//       </main>
//     </>
//   );
// }

import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <>
      <main className="mx-auto max-w-2xl p-8 space-y-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-gray-600">
            We'd love to hear from you! Feel free to reach out through any of the channels below.
          </p>
        </header>

        {/* Social media */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Social Media</h2>
          {/* <p className="text-gray-600">Follow our socials!</p> */}
          <ul className="flex flex-wrap gap-4">
            {/* <li>
              <a
                href="https://twitter.com/YOUR_HANDLE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                X / Twitter
              </a>
            </li> */}
            <li>
              <a
                href="https://instagram.com/OUR_HANDLE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Instagram
              </a>
            </li>
            {/* <li>
              <a
                href="https://linkedin.com/company/YOUR_COMPANY"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            </li> */}
            {/* <li>
              <a
                href="https://facebook.com/YOUR_PAGE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            </li> */}
          </ul>
        </section>

        {/* Other questions */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Other Questions</h2>
          <p className="text-gray-600">
            Want to apply to join the team, or have other general questions? Send us an
            email and we'll get back to you.
          </p>
          <a
            href="mailto:REPLACE@REPLACE.com"
            className="inline-block font-medium text-blue-600 hover:underline"
          >
            REPLACE@REPLACE.com
          </a>
        </section>

        {/* Support */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Support</h2>
          <p className="text-gray-600">Looking to support or donate to our team?</p>
          <Link
            to="/support"
            className="inline-block rounded-lg bg-[#E3256B] px-4 py-2 font-medium text-white hover:bg-[#C71F5C]"
          >
            Visit our Support page →
          </Link>
          {/* <a
            href="/support"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Visit our Support page →
          </a> */}
        </section>
      </main>
    </>
  );
}