import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { FaTwitter, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Movies", href: "/movie" },
      { name: "TV Shows", href: "/" },
      { name: "Trailers", href: "/" },
      { name: "Top Rated", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/" },
      { name: "Careers", href: "/" },
      { name: "Contact", href: "/" },
      { name: "Press", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/" },
      { name: "Terms of Service", href: "/" },
      { name: "Cookie Policy", href: "/" },
    ],
  },
];

const socialIcons = [
  { Icon: FaTwitter, name: "Twitter", href: siteConfig.links.twitter },
  { Icon: FaGithub, name: "GitHub", href: siteConfig.links.github },
  { Icon: FaInstagram, name: "Instagram", href: siteConfig.links.instagram },
  { Icon: FaYoutube, name: "YouTube", href: siteConfig.links.youtube },
];

export const Footer: React.FC = () => {
  return (
    <footer className="">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/favicon-32x32.png"
                width={40}
                height={40}
                alt={`${siteConfig.name} logo`}
              />
              <span className="text-red-600 font-bold text-2xl">
                {siteConfig.name}
              </span>
            </Link>

            <div className="flex space-x-6">
              {socialIcons.map(({ Icon, name, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="text-muted-foreground/80 hover:text-muted-foreground/60 "
                >
                  <span className="sr-only">{name}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerLinks.slice(0, 2).map((column) => (
                <div key={column.title}>
                  <h3 className="text-base font-medium ">{column.title}</h3>
                  <ul className="mt-4 space-y-4">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-base text-muted-foreground/80 hover:text-muted-foreground/60"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerLinks.slice(2).map((column) => (
                <div key={column.title}>
                  <h3 className="text-base font-medium ">{column.title}</h3>
                  <ul className="mt-4 space-y-4">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-base text-muted-foreground/80 hover:text-muted-foreground/60"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Separator className="mt-8 border-muted-foreground/40" />
        <div className="mt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-base text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {siteConfig.creator.name}. All
            rights reserved.
          </p>
          <p className="mt-4 text-base text-muted-foreground/80 sm:mt-0">
            Created by{" "}
            <Link
              href={siteConfig.creator.portfolio}
              className="font-medium underline"
            >
              {siteConfig.creator.name}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
