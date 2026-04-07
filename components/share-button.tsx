"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { Share2, Check } from "lucide-react"

interface ShareButtonProps {
  url?: string
  text?: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  text = "Share",
}) => {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    const shareUrl = url ?? window.location.href
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="secondary" onClick={onClick}>
      {copied ? <Check /> : <Share2 />}
      {copied ? "Copied!" : text}
    </Button>
  )
}
