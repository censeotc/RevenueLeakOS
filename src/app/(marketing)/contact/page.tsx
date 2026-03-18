import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/" className="text-xl font-bold">RevenueLeak OS</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container max-w-lg py-16">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have questions? We&apos;d love to hear from you.
          </p>

          <form className="mt-8 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                type="text"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
