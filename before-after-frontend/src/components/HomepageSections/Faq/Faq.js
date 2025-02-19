import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const BUSINESS_FAQ = [
  {
    _id: 1,
    question: "How do I showcase my before-and-after results on the platform?",
    answer:
      "Simply create an account, upload high-quality images or videos of your transformations, and provide detailed descriptions of your service or product. Our team will review and verify your submission before it goes live.",
  },
  {
    _id: 2,
    question: "What qualifies as a verified transformation?",
    answer:
      "A verified transformation must include authentic, unaltered before-and-after photos or videos, with clear, detailed descriptions of the service or product used. We conduct a verification process to ensure that all transformations are genuine and trustworthy.",
  },
  {
    _id: 3,
    question: "Can I offer a free service or product to showcase my results?",
    answer:
      "Yes! If you’re confident in your product or service, you can offer a free trial to select customers. This allows them to experience the transformation firsthand and share their honest feedback on the platform.",
  },
  {
    _id: 4,
    question:
      "How can showcasing transformations on your platform help my business?",
    answer:
      "By displaying real, verified results, you build trust with potential customers. Authentic transformations attract more attention and engagement, leading to increased credibility, stronger customer relationships, and higher sales.",
  },
  {
    _id: 5,
    question:
      "Are there any costs involved for businesses to join the platform?",
    answer:
      "We offer different membership plans, including free and premium options. The free plan allows basic access, while the premium plan offers additional features like enhanced visibility, analytics, and marketing tools. Contact us for detailed pricing.",
  },
];

const CUSTOMER_FAQ = [
  {
    _id: 1,
    question: "How do I know the before-and-after results are real?",
    answer:
      "All transformations go through a thorough verification process. We ensure that the images and videos are authentic and unedited, and that they accurately represent the changes brought by the product or service. This guarantees that what you see is real.",
  },
  {
    _id: 2,
    question: "Can I apply for a free transformation trial?",
    answer:
      "Absolutely! Customers can apply to be selected for a free transformation trial. If chosen, you’ll receive a product or service for free and have the chance to document your journey, sharing your honest before-and-after results.",
  },
  {
    _id: 3,
    question: "How do I engage with businesses and their transformations?",
    answer:
      "You can follow your favourite businesses, leave comments, ask questions, and write reviews on the transformations you’ve seen or experienced. This helps other customers make informed decisions and builds a community of trust.",
  },
  {
    _id: 4,
    question:
      "What if I’m not satisfied with the transformation I received from a business?",
    answer:
      "If a business’s product or service doesn’t meet your expectations, you’re encouraged to share your honest feedback on the platform. We promote transparency and authentic reviews, so your experience helps others make better decisions.",
  },
  {
    _id: 5,
    question: "How can I track the progress of my transformation journey?",
    answer:
      "Once selected for a transformation trial, you’ll be able to document and track your journey on the platform. You can upload photos, videos, and personal notes, giving others a real-time view of your progress and results.",
  },
];

export default function Faq() {
  return (
    <ResponsiveContainer id="faq" classes={"mt-28"}>
      <h1 className="primary-title mb-10 text-center">
        Got Questions? We&apos;ve Got Answers!
      </h1>

      <div className="mx-auto grid w-full grid-cols-1 gap-20 lg:grid-cols-2 2xl:w-11/12">
        <section className="mx-auto w-full">
          <Badge
            variant={"pending"}
            className="mb-3 rounded-full text-sm font-bold"
          >
            For Business:
          </Badge>
          <Accordion type="single" collapsible>
            {BUSINESS_FAQ.map((faq) => (
              <AccordionItem
                key={faq._id}
                value={faq.question}
                className="mb-4 border border-black/25 px-2"
              >
                <AccordionTrigger className="text-sm font-medium lg:text-base 2xl:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="p-3 pt-0 font-dm-sans text-base leading-snug text-black/75">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto w-full">
          <Badge
            variant={"completed"}
            className="mb-3 rounded-full text-sm font-bold"
          >
            For Customers:
          </Badge>

          <Accordion type="single" collapsible>
            {CUSTOMER_FAQ.map((faq) => (
              <AccordionItem
                key={faq._id}
                value={faq.question}
                className="mb-4 border border-black/25 px-2"
              >
                <AccordionTrigger className="text-sm font-medium lg:text-base 2xl:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="p-3 pt-0 font-dm-sans text-base leading-snug text-black/75">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </ResponsiveContainer>
  );
}
