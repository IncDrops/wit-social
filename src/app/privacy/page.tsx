import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            <p>TrendSights AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
            
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We do not require user accounts. The only data we process is the information you directly provide to our tools, such as topics, captions, and other inputs for content generation and analysis. We do not collect personal information like your name, email address, or IP address.</p>

            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>The data you provide is used solely for the purpose of operating and providing our services to you. Specifically, we use your inputs to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Generate AI-powered content and analysis as requested by you.</li>
              <li>Improve the quality, safety, and performance of our AI models and services.</li>
            </ul>
            <p>We do not use your inputs to build user profiles or for advertising purposes.</p>

            <h2 className="text-xl font-semibold text-foreground">3. Data Retention</h2>
            <p>We do not store your inputs or the generated outputs. Each interaction is stateless. Once your session ends or you navigate away, the data is not retained by our application servers.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We use third-party AI models (e.g., Google's Gemini) to power our tools. Your inputs are sent to these services for processing. We encourage you to review the privacy policies of these third-party services. We are not responsible for the data handling practices of third parties.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Security</h2>
            <p>We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

            <h2 className="text-xl font-semibold text-foreground">6. Changes to this Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
            
            <h2 className="text-xl font-semibold text-foreground">7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@trendsights.ai.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
