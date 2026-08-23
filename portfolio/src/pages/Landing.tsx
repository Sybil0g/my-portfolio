import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResumeButton from "../components/ResumeButton";
import ProjectCard from "../components/ProjectCard";
import siteContent from "../data/siteContent";
import { getAllProjects } from "../lib/projects";
import type { Project } from "../types";
import profileImage from "../assets/fili.jpg";

export default function Landing() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then((all) => setFeatured(all.filter((p) => p.featured).slice(0, 3)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-body text-sm text-rose tracking-wide">
            {siteContent.hero.eyebrow}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.1] text-ink mt-4">
            {siteContent.hero.headlineStart}{" "}
            <span className="font-script text-rose text-6xl sm:text-7xl">
              {siteContent.hero.headlineHighlight}
            </span>{" "}
            {siteContent.hero.headlineEnd}
          </h1>

          <p className="font-body text-muted mt-6 max-w-md leading-relaxed">
            {siteContent.hero.subtext}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <Link
              to="/projects"
              className="font-body text-sm uppercase tracking-wide px-6 py-3 rounded-full bg-ink text-cream hover:bg-rose-deep transition-colors"
            >
              View My Work
            </Link>
            <ResumeButton variant="outline" />
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-[2rem] bg-blush-light border border-blush flex items-center justify-center overflow-hidden">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* <span className="font-script text-4xl text-rose/60 text-center px-8">
              add your photo here
              <br />
              <span className="font-body text-xs text-muted uppercase tracking-wide not-italic">
                (swap the placeholder in Landing.tsx)
              </span>
            </span> */}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-sm text-rose tracking-wide uppercase">
              Featured work
            </p>
            <h2 className="font-display text-3xl text-ink mt-2">
              Making ideas look and work{" "}
              <span className="font-script text-rose text-4xl">better.</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="font-body text-sm text-rose hover:text-rose-deep uppercase tracking-wide"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="font-body text-muted">Loading projects…</p>
        ) : featured.length === 0 ? (
          <p className="font-body text-muted">
            No featured projects yet — mark a project as "featured" in the{" "}
            <Link to="/admin" className="text-rose underline">
              admin dashboard
            </Link>{" "}
            to have it show up here.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
