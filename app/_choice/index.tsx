import Image from "next/image";
import backgroundHeader from "./images/background_header.png";
import shuffulButton from "./images/shuffle_button.png";
import omikujiInfoOpen from "./images/omikuji_info_open.png";
import omikujiOpenButton from "./images/omikuji_open_button.png";
import backgroundCenter from "./images/background_center.png";
import backgroundSffuleButton from "./images/background_shuffle_button.png";

import { useEffect, useState } from "react";
import styles from "./choice.module.css";

interface Card {
  id: number;
  rotate: number;
  x: number;
  y: number;
  zIndex: number;
  opacity: number;
}

const VALUE_KEY = "value";
const getRandomPosition = (maxX: number, maxY: number) => {
  return {
    x: (Math.random() - 0.5) * maxX * 2,
    y: (Math.random() - 0.5) * maxY * 2,
    rotate: Math.random() * 260,
    zIndex: Math.floor(Math.random() * 20),
    opacity: 1, // 初期透明度を設定
  };
};

export const Choice = () => {
  useEffect(() => {
    // コンポーネントがマウントされたらスクロール位置を一番上に設定
    window.scrollTo(0, 0);
    shuffleCards(true);
  }, []);
  const [cards, setCards] = useState<Card[]>(
    new Array(15).fill(null).map((_, index) => ({
      id: index,
      ...getRandomPosition(100, 100),
    }))
  );
  const [selectedCard, setSelectedCard] = useState<number | null>(null); // 選択されたカードのID

  const shuffleCards = (isFirst?: boolean) => {
    // カードのIDをシャッフルするための一時配列を作成
    let zIndexes = cards.map((card) => card.id);
    zIndexes = zIndexes.sort(() => 0.5 - Math.random());

    setCards(
      cards.map((card, index) => {
        const zIndex = zIndexes[index]; // シャッフルされたIDをzIndexとして使用
        return {
          ...card,
          rotate: Math.random() * 260,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          zIndex: zIndex, // 更新されたzIndexを設定
        };
      })
    );
  };

  const handleCardClick = (id: number) => {
    setSelectedCard(id); // 選択されたカードのIDを設定
    setCards(
      cards.map((card) => ({
        ...card,
        opacity: card.id === id ? 1 : 0, // 選択されたカード以外を透明にする
      }))
    );
  };

  const submit = () => {
    localStorage.setItem(VALUE_KEY, selectedCard!.toString());
  };
  return (
    <main>
      <Image
        src={selectedCard ? omikujiInfoOpen : backgroundHeader}
        width={780}
        height={1422}
        alt=""
        style={{
          transition: "transform 1.2s ease, opacity 1s ease",
        }}
      />
      <div className="bg-contain relative w-full h-[55vh] flex justify-center items-center p-0 m-0 -my-1.5">
        <Image
          src={backgroundCenter}
          layout="fill"
          objectFit="cover"
          alt={""}
        />
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${
              card.id !== selectedCard ? "w-[55px]" : "w-[95px]"
            }  absolute`}
            style={{
              transform:
                card.id === selectedCard
                  ? "none"
                  : `translate(${card.x}px, ${card.y}px) rotate(${card.rotate}deg)`,
              transition: "transform 1.2s ease, opacity 1s ease", // 透明度の変更に0.3秒かける
              boxShadow:
                card.id !== selectedCard
                  ? "0px 0px 15px 0px rgba(0, 0, 0, 0.15)"
                  : "0px 0px 0px 0px",
              cursor: "pointer",
              zIndex: card.id === selectedCard ? 1000 : card.zIndex,
              opacity: card.opacity,
            }}
            onClick={() => (selectedCard ? submit() : handleCardClick(card.id))}
          >
            <Image
              src="/pic_omikuj.png"
              width={80}
              height={120}
              alt={`カード${card.id + 1}`}
            />
          </div>
        ))}
      </div>
      <div className="w-full bg-cover relative">
        <Image src={backgroundSffuleButton} width={500} height={300} alt={""} />
        <button
          onClick={() => (selectedCard ? submit() : shuffleCards(false))}
          className="mx-auto block absolute top-0 left-[22%]"
        >
          <Image
            src={selectedCard ? omikujiOpenButton : shuffulButton}
            alt=""
            width={210}
            height={51}
          />
        </button>
      </div>
    </main>
  );
};
