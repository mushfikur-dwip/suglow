import { useState } from "react";
import { Search, Shield, CheckCircle, XCircle } from "lucide-react";
import AccountLayout from "@/components/account/AccountLayout";
import { Input } from "@/components/ui/input";

const VerifyProduct = () => {
  const [productCode, setProductCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<
    "idle" | "authentic" | "fake"
  >("idle");

  const handleVerify = () => {
    // Mock verification - in real app, this would call an API
    if (productCode.length > 5) {
      setVerificationResult("authentic");
    } else if (productCode.length > 0) {
      setVerificationResult("fake");
    }
  };

  return (
    <AccountLayout title="Verify Product" breadcrumb="Verify Product">
      <div className="max-w-xl mx-auto text-center">
        <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          Product Authenticity Verification
        </h2>
        <p className="text-muted-foreground mb-8">
          Enter the product code found on your product packaging to verify its
          authenticity.
        </p>

        <div className="flex gap-2 mb-8">
          <Input
            placeholder="Enter product code"
            value={productCode}
            onChange={(e) => {
              setProductCode(e.target.value);
              setVerificationResult("idle");
            }}
            className="flex-1"
          />
          <button onClick={handleVerify} className="btn-primary px-6">
            <Search className="w-4 h-4 mr-2" />
            Verify
          </button>
        </div>

        {verificationResult === "authentic" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <h3 className="font-semibold text-green-800 mb-1">
              Authentic Product
            </h3>
            <p className="text-sm text-green-700">
              This product has been verified as genuine.
            </p>
          </div>
        )}

        {verificationResult === "fake" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <XCircle className="w-12 h-12 mx-auto text-red-600 mb-3" />
            <h3 className="font-semibold text-red-800 mb-1">
              Verification Failed
            </h3>
            <p className="text-sm text-red-700">
              We couldn't verify this product. Please contact support.
            </p>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default VerifyProduct;
