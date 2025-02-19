import Image from "next/image";
import logo from "/public/logos/footer-logo.svg";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    _id: 1,
    title: "For Customers",
    links: [
      {
        title: "Find a Professional",
        route: "/services",
      },
      {
        title: "How it works",
        route: "/how-it-works",
      },
      {
        title: "Login",
        route: "/login",
      },
    ],
  },
  {
    _id: 2,
    title: "For Professionals",
    links: [
      {
        title: "How it works",
        route: "/pro-how-it-works",
      },
      {
        title: "Pricing",
        route: "/pricing",
      },
      {
        title: "Join as a Professional",
        route: "/join-professional",
      },
    ],
  },
  {
    _id: 3,
    title: "Support",
    links: [
      {
        title: "Privacy Policy",
        route: "/privacy-policy",
      },
      {
        title: "Term of Use",
        route: "/terms-of-use",
      },
      {
        title: "About Us",
        route: "/about",
      },
      {
        title: "FAQ",
        route: "/#faq",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-demin-primary-50 py-10">
      <ResponsiveContainer>
        <div className="flex flex-col items-start justify-between gap-y-10 xl:flex-row">
          {/* Left */}
          <div className="lg:w-1/2">
            <Image
              src={logo}
              alt="Logo of Before After Story"
              height={1200}
              width={1200}
              className="h-auto w-auto"
            />

            <p className="mb-4 mt-2 font-medium text-dark-gray">
              Connecting customers with trusted professionals for all your home
              and beauty needs. Explore our platform to find the right expert,
              post requests, and grow your business effortlessly. Your
              satisfaction is our priority.
            </p>

            <div className="flex-center-start gap-x-2">
              <Mail size={16} aria-label="Contact mail icon" />
              <p className="font-medium text-primary-blue">
                info@beforeafterstory.com
              </p>
            </div>

            <div className="flex-center-start mt-1 gap-x-2">
              <Phone size={16} aria-label="Phone number icon" />
              <p className="font-medium text-primary-blue">020 3697 0237</p>
            </div>
          </div>

          {/* Right  */}
          <div className="flex flex-col items-start justify-end gap-x-12 gap-y-8 lg:w-1/2 xl:flex-row">
            {FOOTER_LINKS?.map((item) => (
              <div key={item._id}>
                <h5 className="mb-3 text-2xl font-semibold">{item.title}</h5>

                <div className="space-y-3">
                  {item.links?.map((link) => (
                    <Link
                      key={link.route}
                      href={link.route}
                      className="block text-dark-gray"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-y-4 lg:flex-row">
          {/* Socials */}
          <div className="flex-center-start gap-x-5">
            <Link href="/linked-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  d="M12 24.3115C18.6274 24.3115 24 18.9389 24 12.3115C24 5.68411 18.6274 0.311523 12 0.311523C5.37258 0.311523 0 5.68411 0 12.3115C0 18.9389 5.37258 24.3115 12 24.3115Z"
                  fill="#007AB9"
                />
                <path
                  d="M19.1688 13.277V18.2243H16.3005V13.6085C16.3005 12.4496 15.8863 11.6581 14.8478 11.6581C14.0552 11.6581 13.5844 12.191 13.3765 12.7069C13.301 12.8913 13.2815 13.1474 13.2815 13.406V18.2241H10.413C10.413 18.2241 10.4515 10.4065 10.413 9.59728H13.2817V10.8198C13.276 10.8294 13.2678 10.8388 13.2627 10.848H13.2817V10.8198C13.6629 10.2332 14.3427 9.39471 15.8669 9.39471C17.754 9.39471 19.1688 10.6277 19.1688 13.277ZM7.41222 5.43884C6.43101 5.43884 5.78906 6.08293 5.78906 6.92916C5.78906 7.75743 6.4124 8.42013 7.37457 8.42013H7.39318C8.39365 8.42013 9.0157 7.75743 9.0157 6.92916C8.99666 6.08293 8.39365 5.43884 7.41222 5.43884ZM5.95955 18.2243H8.82703V9.59728H5.95955V18.2243Z"
                  fill="#F1F2F2"
                />
              </svg>
            </Link>

            <Link href="/facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M24.5601 12.3115C24.5601 18.3012 20.1716 23.2657 14.4351 24.1657V15.7803H17.2312L17.7632 12.3115H14.4351V10.0606C14.4351 9.11137 14.9001 8.18652 16.3907 8.18652H17.9038V5.2334C17.9038 5.2334 16.5304 4.99902 15.2174 4.99902C12.4766 4.99902 10.6851 6.66027 10.6851 9.66777V12.3115H7.63818V15.7803H10.6851V24.1657C4.9485 23.2657 0.560059 18.3012 0.560059 12.3115C0.560059 5.68434 5.93287 0.311523 12.5601 0.311523C19.1872 0.311523 24.5601 5.68434 24.5601 12.3115Z"
                  fill="#1877F2"
                />
                <path
                  d="M17.2312 15.7803L17.7632 12.3115H14.4351V10.0605C14.4351 9.11155 14.9 8.18652 16.3906 8.18652H17.9038V5.2334C17.9038 5.2334 16.5306 4.99902 15.2176 4.99902C12.4766 4.99902 10.6851 6.66027 10.6851 9.66777V12.3115H7.63818V15.7803H10.6851V24.1657C11.296 24.2616 11.9222 24.3115 12.5601 24.3115C13.1979 24.3115 13.8241 24.2616 14.4351 24.1657V15.7803H17.2312Z"
                  fill="white"
                />
              </svg>
            </Link>

            <Link href="/twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M12.1201 24.3115C18.7475 24.3115 24.1201 18.9389 24.1201 12.3115C24.1201 5.68411 18.7475 0.311523 12.1201 0.311523C5.4927 0.311523 0.120117 5.68411 0.120117 12.3115C0.120117 18.9389 5.4927 24.3115 12.1201 24.3115Z"
                  fill="#03A9F4"
                />
                <path
                  d="M19.8931 7.49104C19.3085 7.74639 18.69 7.91603 18.0568 7.99472C18.7243 7.59893 19.2232 6.9719 19.4589 6.23261C18.8342 6.60341 18.1507 6.86455 17.4379 7.00472C17.0011 6.53759 16.4338 6.21271 15.8099 6.07233C15.186 5.93196 14.5342 5.98259 13.9394 6.21764C13.3447 6.45268 12.8344 6.86127 12.475 7.39025C12.1156 7.91924 11.9236 8.54413 11.9242 9.18367C11.922 9.42777 11.9468 9.67137 11.9984 9.90998C10.7305 9.8477 9.48993 9.51864 8.35782 8.94429C7.22572 8.36994 6.22751 7.56322 5.4284 6.57683C5.01766 7.27852 4.8904 8.1106 5.07265 8.90299C5.2549 9.69538 5.73289 10.3882 6.40893 10.84C5.90434 10.8264 5.41043 10.6915 4.96893 10.4468V10.4816C4.97035 11.2171 5.22494 11.9297 5.6899 12.4996C6.15485 13.0695 6.80184 13.462 7.52209 13.611C7.24952 13.6826 6.96864 13.7177 6.68683 13.7152C6.48391 13.719 6.28117 13.701 6.08209 13.6616C6.28844 14.2941 6.68571 14.8472 7.21925 15.2448C7.7528 15.6423 8.39641 15.8648 9.06156 15.8816C7.93439 16.7626 6.54484 17.2412 5.11419 17.241C4.85928 17.2432 4.60451 17.2284 4.35156 17.1968C5.81031 18.1373 7.51066 18.6343 9.2463 18.6274C15.1121 18.6274 18.3189 13.7689 18.3189 9.55788C18.3189 9.41735 18.3189 9.28156 18.3079 9.14577C18.9324 8.69504 19.4696 8.13431 19.8931 7.49104Z"
                  fill="white"
                />
              </svg>
            </Link>
          </div>

          <p className="font-medium text-muted">
            &copy; 2024 Before After Story. All rights reserved.
          </p>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
