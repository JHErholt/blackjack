import { Ele } from "./utilities/element.js";
const PLAYER = document.querySelector("#blackjack__player");
const DEALER = document.querySelector("#blackjack__dealer");
const CENTER = document.querySelector("#blackjack__center");

function new_game() {
    // Reset the game
    PLAYER.removeChild(PLAYER.firstChild);
    DEALER.removeChild(DEALER.firstChild);
    CENTER.removeChild(CENTER.firstChild);
    // Setting up the deck
    var deck = [
        "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "AH", // Hearts
        "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "AD", // Diamonds
        "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "AS", // Spades
        "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "AC"  // Clubs
    ];

    // Setting up the players
    var dealer_hand = [];
    var dealer_score = 0;

    var player_hand = [];
    var player_score = 0;

    // Starting the game
    // Deal the dealer
    deal_card(deck, dealer_hand);
    dealer_score += tally_score(dealer_hand);

    // Deal the player 2 cards
    deal_card(deck, player_hand);
    deal_card(deck, player_hand);
    player_score += tally_score(player_hand);

    // Setting up the board
    // Dealer
    let dealer = Ele.make("div", {}, `${dealer_score}`);
    DEALER.appendChild(dealer);

    // Center
    if (player_score == 21) {
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Blackjack!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        CENTER.appendChild(center);
    } else {
        let center = Ele.make("div", {}, [
            Ele.make("span", {
                class: "btn btn--hit", onclick: () => {
                    deal_card(deck, player_hand);
                    player_score = 0;
                    player_score += tally_score(player_hand);

                    PLAYER.removeChild(PLAYER.lastChild);
                    let player = Ele.make("div", {}, `${player_score}`);
                    PLAYER.appendChild(player);

                    if (player_score == 21) {
                        CENTER.removeChild(CENTER.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "BlackJack!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        CENTER.appendChild(center);
                    } else if (player_score > 21) {
                        CENTER.removeChild(CENTER.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "Bust!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        CENTER.appendChild(center);
                    }

                }
            }, "Hit"),
            Ele.make("span", {}, " or "),
            Ele.make("span", {
                class: "btn btn--stand", onclick: () => {
                    while (dealer_score < 17) {
                        deal_card(deck, dealer_hand);
                        dealer_score = 0;
                        dealer_score += tally_score(dealer_hand);

                        DEALER.removeChild(DEALER.lastChild);
                        let dealer = Ele.make("div", {}, `${dealer_score}`);
                        DEALER.appendChild(dealer);
                    }
                    if (player_score == dealer_score) {
                        CENTER.removeChild(CENTER.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "Push!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        CENTER.appendChild(center);
                    } else if (dealer_score > 21) {
                        CENTER.removeChild(CENTER.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "Dealer bust!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        CENTER.appendChild(center);
                    }
                    else if (player_score < dealer_score) {
                        CENTER.removeChild(CENTER.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "Dealer wins!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        CENTER.appendChild(center);
                    } else {
                        CENTER.removeChild(CENTER.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "Player wins!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        CENTER.appendChild(center);
                    }
                }
            }, "Stand")

        ]);
        CENTER.appendChild(center);
    }

    // Player
    let player = Ele.make("div", {}, `${player_score}`);
    PLAYER.appendChild(player);

}

function deal_card(deck, hand) {
    let random_card = choose_random_card(deck.length);
    hand.push(deck[random_card]);
    deck.splice(random_card, 1);
    console.log(hand)
}

function tally_score(hand) {
    let score = 0;

    for (let i = 0; i < hand.length; i++) {
        score += get_card_value(hand[i]);
    }
    if (score > 21) {
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].includes("A")) {
                score -= 10;
            }
        }
    }
    console.log(score);
    return score;
}

function get_card_value(card) {
    let processed_card = card.substring(0, card.length - 1);
    let card_value = 0;
    if (processed_card == "J" || processed_card == "Q" || processed_card == "K") {
        card_value = 10;
    } else if (processed_card == "A") {
        card_value = 11;
    } else {
        card_value = parseInt(processed_card);
    }
    return card_value;
}

function choose_random_card(max) {
    return Math.floor(Math.random() * max);
}



new_game();