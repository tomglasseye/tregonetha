import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import type { Navigation, SiteSettings, NavItem } from "~/types";
import { Button, resolveHref, telHref } from "./ui/Button";
import { formatAddress } from "./sections/ContactDetails";
import { logoSrc } from "~/lib/logo";

function PhoneIcon({ className = "" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z" />
		</svg>
	);
}

export function Header({
	navigation,
	settings,
}: {
	navigation?: Navigation;
	settings?: SiteSettings;
}) {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const toggleRef = useRef<HTMLButtonElement>(null);

	const links: NavItem[] = navigation?.headerLinks ?? [];
	const barLinks = links.filter((l) => l.showInBar);
	const phone = settings?.phone;

	useEffect(() => setOpen(false), [location.pathname]);

	useEffect(() => {
		if (!open) return;
		const { overflow } = document.body.style;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = overflow;
			document.removeEventListener("keydown", onKey);
			toggleRef.current?.focus();
		};
	}, [open]);

	return (
		// The header sits ABOVE the overlay (z-50 vs z-40) so the toggle stays
		// reachable and can morph into the close icon. Its background drops away
		// when open, letting the dark overlay read as full-page.
		<>
			<header
				data-open={open}
				className={`sticky top-0 z-50 transition-colors duration-300 ${
					open
						? "bg-transparent text-cream"
						: "bg-lake text-cream"
				}`}
			>
				<div className="u-container flex h-20 items-center justify-between gap-6 md:h-24">
					<Link
						to="/"
						className="flex shrink-0 items-center gap-3 font-display text-lg leading-tight text-cream no-underline md:text-xl"
					>
						<img
							src={logoSrc(settings, 112)}
							alt=""
							width={56}
							height={56}
							className="h-12 w-12 md:h-14 md:w-14"
						/>
						<span className="sr-only sm:not-sr-only">
							{settings?.businessName ?? "Tregonetha Lake"}
						</span>
					</Link>

					<nav
						aria-label="Main"
						className={`ml-auto hidden items-center gap-6 transition-opacity duration-200 xl:flex ${
							open
								? "pointer-events-none opacity-0"
								: "opacity-100"
						}`}
					>
						{barLinks.map((item, i) => (
							<NavLink
								key={item._key ?? i}
								to={resolveHref({ link: item.link }, settings)}
								className={({ isActive }) =>
									`u-link whitespace-nowrap text-[0.9375rem] font-medium ${isActive ? "text-cream decoration-ember" : "text-cream/85 hover:text-cream"}`
								}
							>
								{item.label}
							</NavLink>
						))}
					</nav>

					<div
						className={`flex items-center gap-3 ${barLinks.length ? "" : "ml-auto"} lg:gap-5`}
					>
						<span
							className={`transition-opacity duration-200 ${
								open
									? "pointer-events-none opacity-0"
									: "opacity-100"
							}`}
						>
							{phone ? (
								<a
									href={telHref(phone)}
									className="hidden items-center gap-2 whitespace-nowrap text-base text-cream/85 no-underline transition-colors hover:text-cream md:inline-flex xl:hidden"
								>
									{phone}
									{/* <PhoneIcon className="h-4 w-4" /> */}
								</a>
							) : null}
						</span>

						{/* On phones the number collapses to just the icon — a tap target,
                not a line of text. */}
						{phone ? (
							<a
								href={telHref(phone)}
								aria-label={`Call ${settings?.phoneLabel ?? "us"} on ${phone}`}
								className={`inline-flex h-11 w-11 items-center justify-center text-cream transition-opacity duration-200 md:hidden ${
									open
										? "pointer-events-none opacity-0"
										: "opacity-100"
								}`}
							>
								<PhoneIcon className="h-5 w-5" />
							</a>
						) : null}

						<span
							className={`hidden transition-opacity duration-200 sm:inline-flex ${
								open
									? "pointer-events-none opacity-0"
									: "opacity-100"
							}`}
						>
							<Button
								cta={navigation?.headerCta}
								settings={settings}
								tone="lake"
							/>
						</span>

						<button
							ref={toggleRef}
							type="button"
							onClick={() => setOpen((v) => !v)}
							aria-expanded={open}
							aria-controls="site-menu"
							className="relative inline-flex h-11 w-11 items-center justify-center rounded-input transition-colors hover:text-mist"
						>
							<span className="sr-only">
								{open ? "Close menu" : "Open menu"}
							</span>
							<span
								aria-hidden
								className="flex flex-col items-center justify-center"
							>
								<span className="u-burger-bar" />
								<span className="u-burger-bar" />
								<span className="u-burger-bar" />
							</span>
						</button>
					</div>
				</div>
			</header>

			<MenuOverlay
				open={open}
				onClose={() => setOpen(false)}
				links={links}
				navigation={navigation}
				settings={settings}
			/>
		</>
	);
}

function MenuOverlay({
	open,
	onClose,
	links,
	navigation,
	settings,
}: {
	open: boolean;
	onClose: () => void;
	links: NavItem[];
	navigation?: Navigation;
	settings?: SiteSettings;
}) {
	const panelRef = useRef<HTMLDivElement>(null);
	const phone = settings?.phone;

	useEffect(() => {
		if (open) panelRef.current?.focus();
	}, [open]);

	// Everything after the links continues the stagger.
	const tailIndex = links.length + 1;

	return (
		<div
			id="site-menu"
			role="dialog"
			aria-modal="true"
			aria-label="Site menu"
			aria-hidden={!open}
			data-open={open}
			className="u-menu fixed inset-0 z-40 bg-lake text-cream"
		>
			<div
				ref={panelRef}
				tabIndex={-1}
				className="flex h-full flex-col justify-center overflow-y-auto px-0 pb-10 pt-24 outline-none"
			>
				<div className="u-container">
					{phone ? (
						<a
							href={telHref(phone)}
							onClick={onClose}
							style={{ "--i": 0 } as React.CSSProperties}
							className="u-menu-item inline-flex w-fit items-center gap-3 font-display text-2xl text-cream no-underline transition-opacity hover:opacity-80 md:text-3xl"
						>
							{settings?.phoneLabel
								? `Call ${settings.phoneLabel}: `
								: "Call "}
							{phone}
							{/* <PhoneIcon className="h-6 w-6" /> */}
						</a>
					) : null}

					<nav aria-label="All pages" className="mt-10">
						<ul>
							{links.map((item, i) => (
								<li
									key={item._key ?? i}
									style={
										{ "--i": i + 1 } as React.CSSProperties
									}
									className="u-menu-item"
								>
									<Link
										to={resolveHref(
											{ link: item.link },
											settings,
										)}
										onClick={onClose}
										className="block py-2 text-lg text-cream/70 no-underline transition-colors duration-200 hover:text-cream md:text-xl"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{navigation?.headerCta?.label ? (
						<div
							style={{ "--i": tailIndex } as React.CSSProperties}
							className="u-menu-item mt-10"
						>
							<Button
								cta={navigation.headerCta}
								settings={settings}
								tone="lake"
							/>
						</div>
					) : null}

					<div
						style={{ "--i": tailIndex + 1 } as React.CSSProperties}
						className="u-menu-item mt-12 space-y-1 border-t border-cream/15 pt-8 text-sm text-cream/60"
					>
						{settings?.email ? (
							<p>
								<a
									href={`mailto:${settings.email}`}
									className="text-cream/60 no-underline hover:text-cream"
								>
									{settings.email}
								</a>
							</p>
						) : null}
						{settings?.address ? (
							<address className="not-italic">
								{formatAddress(settings.address)}
							</address>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
