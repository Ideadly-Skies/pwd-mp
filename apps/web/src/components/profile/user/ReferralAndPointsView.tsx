import { useState } from 'react'
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Coins } from 'lucide-react'

interface ReferralAndPointsViewProps {
  referralCode: string
  totalPoint: number
}

const ReferralAndPointsView: React.FC<ReferralAndPointsViewProps> = ({ referralCode, totalPoint }) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setIsCopied(true)
      toast.success("Referral code copied to clipboard!")
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      toast.error("Failed to copy referral code")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Referral & Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Referral Code</h3>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm">{referralCode}</code>
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                {isCopied ? (
                  "Copied!"
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Total Points</h3>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Coins className="h-6 w-6 text-yellow-500" />
              {totalPoint}
            </div>
          </div>

          <div className='pt-3'>
                <h1 className='font-bold text-md'>Invite the others and gain 10000 Points for each referration to your code.</h1>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReferralAndPointsView