import { db } from '@/lib/firestore';
import { slugify } from '@/utils/slugify';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


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

const BlogCard = async ({ blogsData, location_slug }) => {
  const extractBlogData = await getBlogs();
  const [featuredBlog, ...moreBlogs] = extractBlogData || [];
  const supportingBlogs = moreBlogs.slice(0, 3);

  return (
    <section className="ppp-home-blogs">
      {featuredBlog ? (
        <div className="ppp-home-blogs__featured">
          <Link href={`blogs/${slugify(featuredBlog.title)}?uid=${featuredBlog.id}`} prefetch className="ppp-home-blogs__featured-media">
            <Image
              src={featuredBlog?.featuredImage || "https://storage.googleapis.com/aerosports/common/gallery-thummbnail-wall-climbwall.jpg"}
              width={900}
              height={540}
              alt={featuredBlog?.title || "Featured blog article"}
              title={featuredBlog?.title}
              unoptimized
            />
            <span className="ppp-home-blogs__featured-chip">Featured</span>
          </Link>
          <div className="ppp-home-blogs__featured-copy">
            <div className="ppp-home-blogs__featured-meta">
              <span className="ppp-home-blogs__eyebrow">Featured article</span>
              <span className="ppp-home-blogs__date">{formatBlogDate(featuredBlog.createdAt)}</span>
            </div>
            <Link href={`blogs/${slugify(featuredBlog.title)}?uid=${featuredBlog.id}`} prefetch>
              <h3 className="ppp-home-blogs__featured-title">{featuredBlog?.title}</h3>
            </Link>
            <div className="ppp-home-blogs__featured-actions">
              <span className="ppp-home-blogs__featured-hint">Quick, visual reads for your next visit</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="ppp-home-blogs__grid">
        {supportingBlogs.length > 0 ? supportingBlogs.map((item, i) => {
          const slug = slugify(item.title);
          return (
            <Link href={`blogs/${slug}?uid=${item.id}`} prefetch key={item.id}>
              <article className="aero_home_article_card ppp-home-blogs__card">
                <div className="ppp-home-blogs__card-media">
                  <Image
                    src={item?.featuredImage || "https://storage.googleapis.com/aerosports/common/gallery-thummbnail-wall-climbwall.jpg"}
                    width={320}
                    height={220}
                    alt={item?.title || "Blog article image"}
                    title={item?.title}
                    unoptimized
                  />
                  <span className="ppp-home-blogs__card-index">{String(i + 2).padStart(2, "0")}</span>
                </div>
                <div className="aero_home_article_desc ppp-home-blogs__card-body">
                  <span className="ppp-home-blogs__card-date">{formatBlogDate(item.createdAt)}</span>
                  <h3>{item?.title}</h3>
                  <span className="aero_home_article_cta">Continue Reading</span>
                </div>
              </article>
            </Link>
          );
        }) : (
          <article className="ppp-home-blogs__empty">
            <span className="ppp-home-blogs__eyebrow">Blog updates</span>
            <h3>More stories are on the way.</h3>
            <p>We’re preparing fresh planning tips, attraction highlights, and event ideas for upcoming visits.</p>
          </article>
        )}
      </div>
    </section>
  );
};

export default BlogCard
