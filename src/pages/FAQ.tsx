import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "We deliver within 2-5 business days inside Dhaka and 5-7 business days outside Dhaka. You will receive tracking information once your order is shipped.",
      },
      {
        q: "What are the shipping charges?",
        a: "Shipping is free for orders above ৳2,000. For orders below ৳2,000, a flat shipping fee of ৳100 applies inside Dhaka and ৳150 outside Dhaka.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is shipped, you will receive an SMS and email with tracking details. You can also track your order from your account dashboard.",
      },
      {
        q: "Do you deliver outside Bangladesh?",
        a: "Currently, we only deliver within Bangladesh. We are working on expanding our delivery network internationally.",
      },
    ],
  },
  {
    category: "Products & Authenticity",
    questions: [
      {
        q: "Are all products authentic?",
        a: "Yes, 100% of our products are authentic and sourced directly from brands or authorized distributors. You can verify any product using our Verify Product feature in your account.",
      },
      {
        q: "What is the shelf life of products?",
        a: "All our products have a minimum of 12 months shelf life from the date of purchase. Expiry dates are clearly mentioned on the product packaging.",
      },
      {
        q: "Can I get product recommendations?",
        a: "Absolutely! Our beauty experts are available to help you find the perfect products for your skin type and concerns. Contact us via our support channels.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and all major credit/debit cards (Visa, Mastercard, American Express).",
      },
      {
        q: "Is it safe to pay online?",
        a: "Yes, all online payments are processed through secure, encrypted payment gateways. Your financial information is never stored on our servers.",
      },
      {
        q: "Can I pay in installments?",
        a: "We currently don't offer installment options. However, you can use your bank's EMI facility if available on your card.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unopened and unused products in original packaging. Some products like opened skincare items are not eligible for return due to hygiene reasons.",
      },
      {
        q: "How do I request a refund?",
        a: "Contact our support team with your order details. Once we receive and inspect the returned product, refund will be processed within 5-7 business days.",
      },
      {
        q: "What if I receive a damaged product?",
        a: "Please contact us within 24 hours of delivery with photos of the damaged product. We will arrange for a replacement or full refund.",
      },
    ],
  },
  {
    category: "Account & Rewards",
    questions: [
      {
        q: "How do I earn reward points?",
        a: "Earn 1 point for every ৳10 spent. You also earn 10 points for writing reviews and 50 points for referring friends who make their first purchase.",
      },
      {
        q: "How do I use my coupons?",
        a: "Enter your coupon code at checkout in the 'Coupon Code' field and click 'Apply'. The discount will be reflected in your order total.",
      },
      {
        q: "Can I reset my password?",
        a: "Yes, click on 'Forgot Password' on the login page and enter your registered email. You will receive a link to reset your password.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-pink-soft py-12">
          <div className="container-custom text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find answers to common questions about orders, shipping, products, and more
            </p>
          </div>
        </section>

        <section className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="bg-secondary/30 rounded-lg px-4 border-none"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-primary/10 to-pink-soft rounded-xl p-8 text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <Link to="/contact" className="btn-primary">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
