/**
 * 松屋・松のや・マイカリー食堂の市区町村内訳（ユーザー提供の公式ベース一覧）。
 * OSM 集計より優先して表示・安価チェーン合計に反映する。
 *
 * 神戸市: 行政区ごとの「合計」のみ（ブランド別は別段なし）→ matsuya / matsunoya は null、matsuGroupTotal を使用。
 */
window.HYOGO_OFFICIAL_MATSU = {
  神戸市中央区: { groupTotal: 5 },
  神戸市西区: { groupTotal: 5 },
  神戸市北区: { groupTotal: 3 },
  神戸市灘区: { groupTotal: 2 },
  神戸市兵庫区: { groupTotal: 1 },
  神戸市須磨区: { groupTotal: 1 },
  神戸市長田区: { groupTotal: 1 },
  尼崎市: { matsuya: 6, matsunoya: 3, myCurry: 0 },
  西宮市: { matsuya: 3, matsunoya: 3, myCurry: 0 },
  姫路市: { matsuya: 4, matsunoya: 1, myCurry: 0 },
  加古川市: { matsuya: 3, matsunoya: 1, myCurry: 0 },
  川西市: { matsuya: 1, matsunoya: 1, myCurry: 1 },
  三田市: { matsuya: 1, matsunoya: 1, myCurry: 0 },
  明石市: { matsuya: 0, matsunoya: 2, myCurry: 0 },
  三木市: { matsuya: 1, matsunoya: 1, myCurry: 0 },
  伊丹市: { matsuya: 1, matsunoya: 0, myCurry: 0 },
  宝塚市: { matsuya: 1, matsunoya: 0, myCurry: 0 },
  たつの市: { matsuya: 1, matsunoya: 0, myCurry: 0 },
  播磨町: { matsuya: 1, matsunoya: 0, myCurry: 0 }
};
