"use client";
import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const PromotionModal = ({ promotionPopup = [], promotions = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const livePromotions = useMemo(
    () =>
      Array.isArray(promotions)
        ? promotions
            .filter(
              (item) =>
                String(item?.isactive ?? item?.active ?? "1") !== "0" &&
                [item?.title, item?.description, item?.code, item?.linktext]
                  .some((value) => String(value || "").trim() !== ""),
            )
            .slice(0, 2)
        : [],
    [promotions],
  );
  const sanitizedHTML = useMemo(
    () => promotionPopup[0]?.value?.replace(/<br\s*\/?>/gi, "").trim() || "",
    [promotionPopup],
  );
  const hasPopupHtml = Boolean(sanitizedHTML);
  const promotionCount = livePromotions.length;
  const sessionKey = useMemo(() => {
    if (hasPopupHtml && promotionCount > 0) {
      return `promotion-popup:${sanitizedHTML}`;
    }

    return `promotion-popup:${livePromotions
      .map((promo) => [promo?.title, promo?.description, promo?.code, promo?.validity].join("|"))
      .join("||")}`;
  }, [hasPopupHtml, livePromotions, sanitizedHTML]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (promotionCount > 0) {
      const alreadySeen = window.sessionStorage.getItem(sessionKey);
      setIsModalOpen(!alreadySeen);
    } else {
      setIsModalOpen(false);
    }
  }, [hasPopupHtml, promotionCount, sessionKey]);

  const closeModal = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(sessionKey, "seen");
    }
    setIsModalOpen(false);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      {sanitizedHTML && promotionCount > 0 ? (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          className="aero_promotion_popup"
        />
      ) : livePromotions.length > 0 ? (
        <div className="aero_promotion_popup_shell">
          <div className={`aero_promotion_popup_grid${livePromotions.length === 1 ? " aero_promotion_popup_grid--single" : ""}`}>
            {livePromotions.map((promo, index) => {
              const imageUrl =
                promo?.image ||
                promo?.bgimage ||
                promo?.backgroundimage ||
                promo?.smallimage ||
                (index % 2 === 0
                  ? "/assets/images/floorchallenge.jpg"
                  : "/assets/images/arcade.JPG");

              return (
            <article
              className="aero_promotion_popup aero_promotion_popup--card"
              key={`${promo.title || "promo"}-${index}`}
            >
              <div
                className="aero_promotion_popup__bg"
                style={{ backgroundImage: `url('${imageUrl}')` }}
                aria-hidden="true"
              />
              {promo.badge && (
                <span className="aero_promotion_popup__badge">{promo.badge}</span>
              )}
              <div className="aero_promotion_popup__pixels" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h2 className="aero_promotion_popup__title">{promo.title || "Current Promotion"}</h2>
              {promo.description && <p className="aero_promotion_popup__description">{promo.description}</p>}
              <div className="aero_promotion_popup__meta">
                {promo.validity && (
                  <time className="aero_promotion_popup__validity">{promo.validity}</time>
                )}
                {promo.code && (
                  <span className="aero_promotion_popup__code-wrap">
                    <span className="aero_promotion_popup__code-label">Code</span>
                    <strong className="aero_promotion_popup__code">{promo.code}</strong>
                  </span>
                )}
              </div>
              {promo.link && (
                <a
                  href={promo.link}
                  className="aero_promotion_popup__cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {promo.linktext || "Claim Offer"}
                </a>
              )}
            </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default PromotionModal;
