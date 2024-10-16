import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  FaFacebook,
  FaDiscord,
  FaTwitter,
  FaGithub,
  FaDribbble,
} from "react-icons/fa";
import Link from "next/link";

const footerLinks = [
  {
    title: "Resources",
    links: [
      { name: "Flowbite", href: "https://flowbite.com/" },
      { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
    ],
  },
  {
    title: "Follow us",
    links: [
      { name: "Github", href: "https://github.com/themesberg/flowbite" },
      { name: "Discord", href: "https://discord.gg/4eeurUVvTy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms & Conditions", href: "#" },
    ],
  },
];

const socialIcons = [
  { Icon: FaFacebook, name: "Facebook page" },
  { Icon: FaDiscord, name: "Discord community" },
  { Icon: FaTwitter, name: "Twitter page" },
  { Icon: FaGithub, name: "GitHub account" },
  { Icon: FaDribbble, name: "Dribbble account" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="mx-20">
      <div className="w-full p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="https://flowbite.com/" className="flex items-center">
              <Image
                src="/placeholder.svg"
                width={100}
                height={100}
                className="h-8 me-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Flowbite
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h2 className="mb-6 text-sm font-semibold uppercase">
                  {column.title}
                </h2>
                <ul className="text-muted-foreground font-medium">
                  {column.links.map((link) => (
                    <li key={link.name} className="mb-4">
                      <Link href={link.href} className="hover:underline">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-6 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground sm:text-center">
            © 2023{" "}
            <Link href="https://flowbite.com/" className="hover:underline">
              Flowbite™
            </Link>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {socialIcons.map(({ Icon, name }) => (
              <Link
                key={name}
                href="#"
                className="text-muted-foreground hover:text-gray-900 ms-5"
              >
                <Icon />
                <span className="sr-only">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
