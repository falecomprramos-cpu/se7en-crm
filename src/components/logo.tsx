import Image from "next/image"

interface LogoProps {
  className?: string
  size?: number | "sm" | "md" | "lg"
}

export function Logo({ className, size = 180 }: LogoProps) {

  const imageSize =
    size === "sm" ? 80 :
    size === "md" ? 120 :
    size === "lg" ? 180 :
    size

  return (
    <Image
      src="/logo.png"
      alt="SE7EN CRM"
      width={imageSize}
      height={imageSize}
      className={className}
      loading="eager"
    />
  )
}


