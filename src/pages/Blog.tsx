import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";

const categories = ["All", "Sustainability", "Community", "Innovation", "Health"];

const blogPosts = [
  {
    slug: "future-sustainable-sanitation",
    title: "The Future of Sustainable Sanitation in West Africa",
    excerpt:
      "Exploring innovative approaches to community hygiene and infrastructure development that are shaping the future of public health in the region.",
    category: "Innovation",
    date: "January 15, 2026",
    readTime: "5 min read",
  },
  {
    slug: "community-engagement",
    title: "Community Engagement: Key to Lasting Change",
    excerpt:
      "How local involvement and ownership transforms sanitation outcomes and creates sustainable behavioral change.",
    category: "Community",
    date: "January 10, 2026",
    readTime: "4 min read",
  },
  {
    slug: "waste-to-value",
    title: "Waste-to-Value: Turning Challenges into Opportunities",
    excerpt:
      "Innovative waste management practices that create economic value while protecting the environment.",
    category: "Sustainability",
    date: "January 5, 2026",
    readTime: "6 min read",
  },
  {
    slug: "hygiene-education-schools",
    title: "Hygiene Education in Schools: Building Healthy Habits Early",
    excerpt:
      "The impact of comprehensive hygiene education programs on student health and community well-being.",
    category: "Health",
    date: "December 28, 2025",
    readTime: "5 min read",
  },
  {
    slug: "sustainable-infrastructure",
    title: "Designing Sustainable Sanitation Infrastructure",
    excerpt:
      "Best practices for building durable, eco-friendly sanitation facilities that serve communities for generations.",
    category: "Sustainability",
    date: "December 20, 2025",
    readTime: "7 min read",
  },
  {
    slug: "partnership-impact",
    title: "The Power of Partnerships in Public Health",
    excerpt:
      "How collaborative approaches between NGOs, governments, and communities amplify public health outcomes.",
    category: "Community",
    date: "December 15, 2025",
    readTime: "4 min read",
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 hero-gradient">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Blog
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Insights & <span className="gradient-text">Knowledge</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed with the latest insights on sustainable sanitation,
              community development, and public health innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="section-container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block h-full p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <span className="text-sm text-primary font-medium flex items-center group-hover:underline">
                        Read more
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <SectionHeading
              badge="Stay Updated"
              title="Subscribe to Our Newsletter"
              description="Get the latest insights delivered directly to your inbox."
            />
            <div className="mt-8 flex gap-3">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
