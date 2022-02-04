import * as React from "react";
import { Link } from "react-router-dom";

import { useLocale } from "../../../hooks";
import { Submenu } from "../submenu";

import "./index.scss";

export const GuidesMenu = ({ visibleSubMenuId, toggleMenu }) => {
  const locale = useLocale();

  const menu = {
    label: "Guides",
    id: "guides",
    items: [
      {
        description: "Learn web development",
        extraClasses: "apis-link-container",
        hasIcon: true,
        iconClasses: "submenu-icon",
        label: "MDN Learning Area",
        url: `/${locale}/docs/Learn`,
      },
      {
        description: "Learn to structure Web content with HTML",
        extraClasses: "html-link-container",
        hasIcon: true,
        iconClasses: "submenu-icon html",
        label: "HTML",
        url: `/${locale}/docs/Learn/HTML`,
      },
      {
        description: "Learn to style content using CSS",
        extraClasses: "css-link-container",
        hasIcon: true,
        iconClasses: "submenu-icon css",
        label: "CSS",
        url: `/${locale}/docs/Learn/CSS`,
      },
      {
        description: "Learn to run scripts in the browser",
        extraClasses: "javascript-link-container",
        hasIcon: true,
        iconClasses: "submenu-icon javascript",
        label: "JavaScript",
        url: `/${locale}/docs/Learn/JavaScript`,
      },

      {
        description: "Learn to work with user data",
        hasIcon: true,
        iconClasses: "submenu-icon",
        label: "Web Forms",
        url: `/${locale}/docs/Learn/Forms`,
      },
      {
        description: "Learn to make the Web accessible to all",
        hasIcon: true,
        iconClasses: "submenu-icon",
        label: "Accessibility",
        url: `/${locale}/docs/Web/Accessibility`,
      },
    ],
  };
  const isOpen = visibleSubMenuId === menu.id;

  return (
    <li key={menu.id} className="top-level-entry-container">
      <button
        type="button"
        id={`${menu.id}-button`}
        className="top-level-entry menu-toggle"
        aria-haspopup="menu"
        aria-expanded={isOpen || undefined}
        onClick={() => {
          toggleMenu(menu.id);
        }}
      >
        {menu.label}
      </button>

      <Link
        to={`/${locale}/docs/Learn/`}
        className="top-level-entry"
        // @ts-ignore
        onClick={() => document?.activeElement?.blur()}
      >
        Guides
      </Link>

      <Submenu menuEntry={menu} defaultHidden={!isOpen} />
    </li>
  );
};