import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>Welcome to WIT Social AI. By accessing or using our application, you agree to be bound by these Terms of Use. If you do not agree with these terms, please do not use our services.</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Use of Service</h2>
            <p>WIT Social AI provides AI-powered tools for social media content generation and analysis. You are granted a non-exclusive, non-transferable, revocable license to access and use our services strictly in accordance with these terms.</p>
            <p>You agree not to use the service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service.</p>

            <h2 className="text-xl font-semibold text-foreground">2. User Content</h2>
            <p>You are responsible for any content (e.g., text, prompts) you provide. You retain ownership of your content, but you grant WIT Social AI a worldwide, royalty-free license to use, reproduce, and process this data to provide and improve the service.</p>

            <h2 className="text-xl font-semibold text-foreground">3. No Accounts</h2>
            <p>Our service does not require user registration or accounts. All interactions are transactional and session-based.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Disclaimer of Warranties</h2>
            <p>The service is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or that the results obtained from the use of the service will be accurate or reliable.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>In no event shall WIT Social AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

            <h2 className="text-xl font-semibold text-foreground">6. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions.</p>
            
            <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Use on this page.</p>
            
            <h2 className="text-xl font-semibold text-foreground">8. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@willittrend.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
