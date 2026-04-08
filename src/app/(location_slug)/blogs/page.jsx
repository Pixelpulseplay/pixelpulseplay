export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import "../../styles/blogs.css";
import React from "react";
import Link from "next/link";
import { fetchMenuData, generateMetadataLib } from "@/lib/sheets";
import { db } from "@/lib/firestore";
import { slugify } from "@/utils/slugify";
import SectionHeading from "@/components/home/SectionHeading";
import BookingButton from "@/components/smallComponents/BookingButton";

export async function generateMetadata({ params }) {
  const location_slug = params?.location_slug || "vaughan";
  const BASE_URL = process.env.SITE_URL;

  const title = `Blogs | Pixel Pulse Play ${location_slug}`;
  const description =
    "Read the latest blogs, guides, and updates from Pixel Pulse Play. Discover arcade tips, challenge room experiences, and fun activities for families and groups.";

  const url = `${BASE_URL}/${location_slug}/blogs`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Pixel Pulse Play",
      images: [
        {
          url: "https://storage.googleapis.com/pixel-pulse-play/web/h-Logo.png",
          width: 1200,
          height: 630,
          alt: "Pixel Pulse Play Blogs",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://storage.googleapis.com/pixel-pulse-play/web/h-Logo.png",
      ],
    },
  };
}

export async function getBlogs() {
  if (!db) {
    return [];
  }

  try {
    const snapshot = await db
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((blog) => blog.createdAt);
  } catch (error) {
    console.error("Firestore Error:", error);
    return [];
  }
}

function formatBlogDate(createdAt) {
  if (!createdAt?.seconds) return "Latest update";

  return new Date(createdAt.seconds * 1000).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const page = async ({ params }) => {
  const location_slug = params?.location_slug || "vaughan";
  const extractBlogData = await getBlogs();
  const [featuredBlog, ...remainingBlogs] = extractBlogData || [];
  const [spotlightBlog, ...gridBlogs] = remainingBlogs;

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Pixel Pulse Play Blog",
  description:
    "Read the latest blogs, guides, and updates from Pixel Pulse Play.",
  url: `${process.env.SITE_URL}/${location_slug}/blogs`,
  blogPost: extractBlogData?.map((blog) => {
    const slug = slugify(blog.title);

    return {
      "@type": "BlogPosting",
      headline: blog.title,
      url: `${process.env.SITE_URL}/${location_slug}/blogs/${slug}?uid=${blog.id}`,
      image:
        blog.featuredImage ||
        "https://storage.googleapis.com/pixel-pulse-play/web/h-Logo.png",
      datePublished: blog?.createdAt?.seconds
        ? new Date(blog.createdAt.seconds * 1000).toISOString()
        : null,
      author: {
        "@type": "Organization",
        name: "Pixel Pulse Play",
      },
    };
  }),
};

  return (
    <main className="aero-blog-main-section ppp-blogs-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <section className="ppp-blogs-hero">
        <div className="aero-max-container ppp-blogs-hero__inner">
          <div className="ppp-blogs-hero__copy">
            <span className="ppp-blogs-hero__eyebrow">Stories + Updates</span>
            <h1 className="ppp-blogs-hero__title">
              Scroll-worthy stories from Pixel Pulse.
            </h1>
            <p className="ppp-blogs-hero__text">
              Fast reads, visual highlights, and ideas for parties, attractions, and group visits.
            </p>
            <div className="ppp-blogs-hero__stats">
              <article className="ppp-blogs-stat">
                <span>Latest posts</span>
                <strong>{extractBlogData?.length || 0}</strong>
              </article>
              <article className="ppp-blogs-stat">
                <span>Focus</span>
                <strong>Visits + Events</strong>
              </article>
              <article className="ppp-blogs-stat">
                <span>Best for</span>
                <strong>Families & Groups</strong>
              </article>
            </div>
          </div>

          <div className="ppp-blogs-hero__panel">
            <div className="ppp-blogs-hero-card">
              {featuredBlog ? (
                <>
                  <span className="ppp-blogs-hero-card__label">Featured story</span>
                  <Link
                    href={`blogs/${slugify(featuredBlog.title)}?uid=${featuredBlog.id}`}
                    prefetch
                    className="ppp-blogs-hero-card__media"
                  >
                    <img
                      src={featuredBlog?.featuredImage || "/assets/images/logo.png"}
                      alt={featuredBlog?.title || "Featured blog article"}
                    />
                    <span className="ppp-blogs-hero-card__chip">Top pick</span>
                  </Link>
                  <span className="ppp-blogs-hero-card__date">
                    {formatBlogDate(featuredBlog.createdAt)}
                  </span>
                  <Link href={`blogs/${slugify(featuredBlog.title)}?uid=${featuredBlog.id}`} prefetch>
                    <h2>{featuredBlog.title}</h2>
                  </Link>
                  <Link
                    href={`blogs/${slugify(featuredBlog.title)}?uid=${featuredBlog.id}`}
                    prefetch
                    className="ppp-blog-card__link ppp-blog-card__link--featured"
                  >
                    Read Featured Post
                  </Link>
                </>
              ) : (
                <>
                  <span className="ppp-blogs-hero-card__label">What you'll find</span>
                  <h2>Helpful reads for planning visits, discovering attractions, and making group play even better.</h2>
                  <ul>
                    <li>Planning tips for families, parties, and group outings</li>
                    <li>Highlights from attractions, experiences, and events</li>
                    <li>Useful updates that keep your next visit easy to organize</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="aero-max-container ppp-blogs-layout">
        <div className="ppp-blogs-section-intro">
          <SectionHeading mainHeading="true">
            All <span>Blogs</span>
          </SectionHeading>
          <p>
            Pick a story and jump straight in.
          </p>
        </div>

        {spotlightBlog ? (
          <article className="ppp-blogs-spotlight">
            <Link href={`blogs/${slugify(spotlightBlog.title)}?uid=${spotlightBlog.id}`} prefetch className="ppp-blogs-spotlight__media">
              <img
                src={spotlightBlog?.featuredImage || "/assets/images/logo.png"}
                alt={spotlightBlog?.title || "Blog spotlight image"}
              />
              <span className="ppp-blogs-spotlight__chip">Spotlight</span>
            </Link>
            <div className="ppp-blogs-spotlight__body">
              <span className="ppp-blog-card__meta">{formatBlogDate(spotlightBlog.createdAt)}</span>
              <Link href={`blogs/${slugify(spotlightBlog.title)}?uid=${spotlightBlog.id}`} prefetch>
                <h2 className="ppp-blogs-spotlight__title">{spotlightBlog.title}</h2>
              </Link>
              <Link
                href={`blogs/${slugify(spotlightBlog.title)}?uid=${spotlightBlog.id}`}
                prefetch
                className="ppp-blog-card__link ppp-blog-card__link--featured"
              >
                Open Story
              </Link>
            </div>
          </article>
        ) : null}

        <section className="ppp-blogs-grid">
          {gridBlogs?.length > 0 ? gridBlogs.map((item) => {
            const slug = slugify(item.title);
            return (
              <article className="ppp-blog-card" key={item.id}>
                <div className="ppp-blog-card__media">
                  <Link href={`blogs/${slug}?uid=${item.id}`} prefetch>
                    <img
                      src={item?.featuredImage || "/assets/images/logo.png"}
                      alt={item?.title || "Blog article image"}
                    />
                    <span className="ppp-blog-card__chip">Article</span>
                  </Link>
                </div>
                <div className="ppp-blog-card__body">
                  <span className="ppp-blog-card__meta">{formatBlogDate(item.createdAt)}</span>
                  <Link href={`blogs/${slug}?uid=${item.id}`} prefetch>
                    <h2 className="ppp-blog-card__title">{item.title}</h2>
                  </Link>
                  <Link
                    href={`blogs/${slug}?uid=${item.id}`}
                    prefetch
                    className="ppp-blog-card__link"
                  >
                    READ MORE
                  </Link>
                </div>
              </article>
            );
          }) : (
            <article className="ppp-blogs-empty">
              <span className="ppp-blogs-empty__label">More stories coming soon</span>
              <h2>We’re lining up the next set of reads.</h2>
              <p>
                Check back soon for more attraction highlights, planning guides, and party ideas from Pixel Pulse Play.
              </p>
            </article>
          )}
        </section>
      </section>
      <div
        className="d-flex-center aero-btn-booknow"
        style={{ padding: "2em", backgroundColor: "var(--black-color)" }}
      >
        <BookingButton title="Book Now" />
      </div>
    </main>
  );
};

export default page;
