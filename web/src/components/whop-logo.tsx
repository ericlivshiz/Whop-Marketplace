import Image from "next/image";

export function WhopLogo({
	className,
	priority = false,
}: {
	className?: string;
	priority?: boolean;
}) {
	return (
		<Image
			src="/whop-logo-orange.png"
			alt="Whop"
			width={160}
			height={160}
			priority={priority}
			className={className}
		/>
	);
}
