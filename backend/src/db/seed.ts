import { pool } from '../config/db';
import { hashPassword } from '../utils/password';
import { env } from '../config/env';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
    await pool.query(
      `INSERT INTO admins (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, updated_at = NOW()`,
      [env.ADMIN_EMAIL, passwordHash, 'Admin', 'admin']
    );
    console.log(`✅ Admin user created: ${env.ADMIN_EMAIL}`);

    // Seed default website content
    const defaultContent = {
      hero: {
        headline: "WE BUILD DIGITAL EXPERIENCES\nTHAT MOVE BUSINESSES FORWARD.",
        description: "We design and develop fast, modern websites and digital products for businesses that want to stand out, perform better, and grow.",
        primaryCta: "Start a Project",
        secondaryCta: "View Our Work",
      },
      about: {
        heading: "SMALL STUDIO.\nBIG DIGITAL IMPACT.",
        description: "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process.",
        supportingContent: "Every project we take on gets the full attention of our senior team.",
      },
      cta: {
        heading: "HAVE AN IDEA?\nLET'S BUILD IT.",
        description: "Tell us what you're building, what problem you're solving, and what you want your website to achieve.",
        buttonText: "Start a Project",
      },
      contact: {
        email: "hello@vanta.studio",
        phone: "",
        location: "Remote — Worldwide",
        socialLinks: { instagram: "#", linkedin: "#", github: "#", twitter: "#" },
      },
    };

    for (const [section, content] of Object.entries(defaultContent)) {
      await pool.query(
        `INSERT INTO website_content (section, content)
         VALUES ($1, $2)
         ON CONFLICT (section) DO NOTHING`,
        [section, JSON.stringify(content)]
      );
    }
    console.log('✅ Default website content seeded');

    // Seed default settings
    const defaultSettings = {
      general: { agencyName: 'VANTA', logo: '', email: 'hello@vanta.studio', location: 'Remote — Worldwide' },
      social: { instagram: '#', linkedin: '#', github: '#', twitter: '#' },
      seo: { websiteTitle: 'VANTA — Digital Studio', metaDescription: 'Premium digital studio.', ogImage: '' },
      admin: { name: 'Admin', email: env.ADMIN_EMAIL },
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await pool.query(
        `INSERT INTO settings (key, value)
         VALUES ($1, $2)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)]
      );
    }
    console.log('✅ Default settings seeded');

    // Seed default services
    const defaultServices = [
      { name: 'Website Development', short_description: 'Custom-built, high-performance websites.', icon: 'globe', display_order: 1 },
      { name: 'Landing Pages', short_description: 'Conversion-focused landing pages.', icon: 'layout', display_order: 2 },
      { name: 'Business Websites', short_description: 'Professional digital presence for businesses.', icon: 'building', display_order: 3 },
      { name: 'Booking Systems', short_description: 'Restaurant, clinic, and reservation platforms.', icon: 'calendar', display_order: 4 },
      { name: 'E-Commerce', short_description: 'Full-featured online stores.', icon: 'shopping-bag', display_order: 5 },
      { name: 'Custom Web Applications', short_description: 'Tailored web apps for specific business needs.', icon: 'code', display_order: 6 },
      { name: 'Maintenance & Hosting', short_description: 'Ongoing support and infrastructure.', icon: 'server', display_order: 7 },
    ];

    for (const service of defaultServices) {
      await pool.query(
        `INSERT INTO services (name, short_description, icon, display_order)
         SELECT $1::varchar, $2::text, $3::varchar, $4::integer
         WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = $1)`,
        [service.name, service.short_description, service.icon, service.display_order]
      );
    }
    console.log('✅ Default services seeded');

    console.log('\n🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
