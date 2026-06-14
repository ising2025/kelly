

// export default function About() {
//   return (
//     <>
//       <main className="p-8">
//         <h1 className="text-3xl font-bold">About Us</h1>
//       </main>
//     </>
//   );
// }

import { Link } from "react-router-dom";
import "@google/model-viewer";

// The 'competitions' array defines the competition history timeline on the About page.
// The 'mediaAnchor' must match an element id="..." on the Media page, e.g. <section id="fall-classic-2025"> 
const competitions = [
  {
    date: "November 2025",
    name: "Placeholder",
    blurb: "Description",
    mediaAnchor: "media-element-id",
  },
  {
    date: "January 2026",
    name: "Placeholder Event Name",
    blurb: "Description",
    mediaAnchor: "media-element-id",
  },
  {
    date: "March 2026",
    name: "Placeholder Event Name",
    blurb: "Description",
    mediaAnchor: "media-element-id",
  },
];

export default function About() {
  return (
    <>
      <main className="mx-auto max-w-2xl p-8 space-y-12">
        <h1 className="text-3xl font-bold">About Us</h1>

        {/* About / team info */}
        <section className="space-y-3">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="space-y-2 md:flex-1">
              <h2 className="text-xl font-semibold">Who are We?</h2>
              <p className="text-gray-600">
                We're a group of Yale students building combat robots to compete in NHRL.
                REPLACE WITH MORE INFORMATION. blah blah blah blah blah blah blah blah blah 
                blah blah blah blah blah blah blah blah blah blah blah blah
              </p>
            </div>
            <img
              src="/team.jpg"
              alt="Our team"
              className="w-full rounded-lg md:w-1/2"
            />
          </div>
        </section>

        {/* Competition history timeline */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Competition History</h2>
          <ol className="relative ml-3 border-l border-gray-200">
            {competitions.map((comp) => (
              <li key={comp.mediaAnchor} className="mb-8 ml-6">
                <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-[#E3256B]" />
                <time className="text-sm font-medium text-gray-500">
                  {comp.date}
                </time>
                <h3 className="text-lg font-semibold">{comp.name}</h3>
                <p className="text-gray-600">{comp.blurb}</p>
                <Link
                  to={`/media#${comp.mediaAnchor}`}
                  className="mt-1 inline-block font-medium text-blue-600 hover:underline"
                >
                  Photos/Videos →
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Our Robot */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Our Robot</h2>
          <p className="text-gray-600">
            Drag to rotate, scroll to zoom, and right-click to pan.
          </p>

          <model-viewer
            src="/robot.gltf"
            alt="Interactive 3D model of our robot"
            camera-controls
            // auto-rotate
            // shadow-intensity="1"
            poster="/robot-poster.png"
            style={{ width: "100%", height: "500px", backgroundColor: "#1a1a1a"}}
          ></model-viewer>

        </section>
      </main>
    </>
  );
}