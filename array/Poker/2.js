//
// This is only a SKELETON file for the 'Poker' exercise. It's been provided as a
// convenience to get you started writing code faster.
//
const RANKS = ["J", "K", "Q", "A"];

class Card {
  constructor(rank, suit) {
    const i = RANKS.indexOf(rank);
    this.rank = i !== -1 ? i + 11 : parseInt(rank);
    this.suit = suit;
  }
}

class Hand {
  constructor(cards) {
    this.cards = cards;
    this.cardObjs = cards
      .split(" ")
      .map((card) => new Card(card.slice(0, -1), card.slice(-1)));
    this.cardObjs.sort((a, b) => b.rank - a.rank);

    const obj = this.cardObjs
      .map((card) => card.rank)
      .reduce((obj, rank) => {
        obj[rank] = (obj[rank] || 0) + 1;
        return obj;
      }, {});
    this.ranksCount = Object.keys(obj).map((k) => [k, obj[k]]);
    this.ranksCount.sort(([ar, ac], [br, bc]) =>
      ac === bc ? br - ar : bc - ac
    );
    this.handRank = this.findHandRank();
  }

  findHandRank() {
    switch (true) {
      case this.isStraight() && this.isFlush():
        return 8;
      case this.hasMultiple(4):
        return 7;
      case this.hasMultiple(3) && this.hasMultiple(2):
        return 6;
      case this.isFlush():
        return 5;
      case this.isStraight():
        return 4;
      case this.hasMultiple(3):
        return 3;
      case this.hasTwoPairs():
        return 2;
      case this.hasMultiple(2):
        return 1;
      default:
        return 0;
    }
  }

  isStraight() {
    const straight = [...Array(5).keys()].map((k) => this.cardObjs[0].rank - k);
    const ranks = this.cardObjs.map((card) => card.rank);

    return (
      straight.every((s, i) => s === ranks[i]) ||
      [14, 5, 4, 3, 2].every((s, i) => s === ranks[i])
    );
  }

  isFlush() {
    return this.cardObjs.every((c) => c.suit === this.cardObjs[0].suit);
  }

  hasMultiple(count) {
    return !!this.ranksCount.find(([_, c]) => c === count);
  }

  hasTwoPairs() {
    return this.ranksCount.filter(([_, c]) => c === 2).length === 2;
  }

  compare(hand) {
    if (this.handRank === hand.handRank) {
      if (this.handRank === 4) {
        const thisLowest = this.isLowestStraight(
          this.cardObjs.map((c) => c.rank)
        );
        const handLowest = this.isLowestStraight(
          hand.cardObjs.map((c) => c.rank)
        );

        if (thisLowest || handLowest) {
          return thisLowest && handLowest ? 0 : thisLowest ? -1 : 1;
        }
      }

      return this.compareCards(hand, 4);
    }

    return this.handRank - hand.handRank;
  }

  isLowestStraight(ranks) {
    const lowest = [14, 5, 4, 3, 2];
    return ranks.every((r, i) => r === lowest[i]);
  }

  compareCards(hand, no) {
    if (no === 0) return 0;

    if (this.hasMultiple(no) && hand.hasMultiple(no)) {
      const thisRanks = this.ranksCount.filter(([_, c]) => c === no);
      const handRanks = hand.ranksCount.filter(([_, c]) => c === no);

      for (const k in thisRanks) {
        if (thisRanks[k][0] === handRanks[k][0]) continue;

        return thisRanks[k][0] - handRanks[k][0];
      }
    }

    return this.compareCards(hand, no - 1);
  }
}

export const bestHands = (hands) => {
  if (hands.length === 1) {
    return hands;
  }

  const handObjs = hands.map((hand) => new Hand(hand));

  return handObjs
    .sort((a, b) => b.compare(a))
    .filter((h) => h.compare(handObjs[0]) === 0)
    .map((h) => h.cards);
};
