import { Ele } from "./utilities/element.js";
const PLAYER = document.querySelector("#blackjack__player");
const DEALER = document.querySelector("#blackjack__dealer");
const CENTER = document.querySelector("#blackjack__center");

function new_game() {
    // Reset the game
    PLAYER.removeChild(PLAYER.firstChild);
    DEALER.removeChild(DEALER.firstChild);
    CENTER.removeChild(CENTER.firstChild);

    // Player block
    let player_container = Ele.make("div", { class: "player__container" }, "");
    let player_hand_container = Ele.make("div", { class: "player_hand" }, []);
    player_container.appendChild(player_hand_container);
    PLAYER.appendChild(player_container);

    // Dealer block
    let dealer_container = Ele.make("div", { class: "dealer__container" }, "");
    let dealer_hand_container = Ele.make("div", { class: "dealer_hand" }, []);
    dealer_container.appendChild(dealer_hand_container);
    DEALER.appendChild(dealer_container);

    // Center block
    let center_container = Ele.make("div", { class: "center__container" }, "");
    CENTER.appendChild(center_container);

    // Setting up the deck
    var deck = [
        "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH", "A+H", // Hearts
        "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD", "A+D", // Diamonds
        "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS", "A+S", // Spades
        "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC", "A+C"  // Clubs
    ];

    // Setting up the players
    var dealer_hand = [];
    var dealer_score = 0;

    var player_hand = [];
    var player_score = 0;

    // Starting the game
    // Deal the dealer
    deal_card(deck, dealer_hand, "dealer_hand");
    dealer_score += tally_score(dealer_hand);

    // Deal the player 2 cards

    deal_card(deck, player_hand, "player_hand");
    deal_card(deck, player_hand, "player_hand");
    player_score += tally_score(player_hand);

    // Setting up the board

    // Setting up the scores
    // Dealer
    let dealer = Ele.make("div", { class: "dealer_score" }, `Dealer: ${dealer_score}`);
     dealer_container.appendChild(dealer);
    // // Player
    let player_score_container = Ele.make("div", { class: "player_score" }, `Player: ${player_score}`);
    player_container.appendChild(player_score_container);

    // Center
    if (player_score == 21) {
        deal_the_dealer(deck, dealer_hand, dealer_score, player_score);
    } else {
        let center = Ele.make("div", { class: "center" }, [
            Ele.make("span", {
                class: "btn btn--hit", onclick: () => {
                    deal_card(deck, player_hand, "player_hand");
                    player_score = 0;
                    player_score += tally_score(player_hand);

                    player_container.removeChild(player_container.lastChild);
                    let player = Ele.make("div", { class: "player_score" }, `Player: ${player_score}`);
                    player_container.appendChild(player);

                    if (player_score == 21) {
                        deal_the_dealer(deck, dealer_hand, dealer_score, player_score);
                    } else if (player_score > 21) {
                        center_container.removeChild(center_container.lastChild);
                        let center = Ele.make("div", { class: "end_game_message" }, [
                            Ele.make("span", {}, "Bust!"),
                            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
                        ]);
                        center_container.appendChild(center);
                    }
                }
            }, "Hit"),
            Ele.make("span", {}, " or "),
            Ele.make("span", {
                class: "btn btn--stand", onclick: () => {
                    center_container.removeChild(center_container.lastChild);
                    deal_the_dealer(deck, dealer_hand, dealer_score, player_score);
                }
            }, "Stand")

        ]);
        center_container.appendChild(center);
    }




}











function deal_card(deck, hand, hand_container) {
    let random_card = choose_random_card(deck.length);
    hand.push(deck[random_card]);
    deck.splice(random_card, 1);
    print_card(hand, document.querySelector(`.${hand_container}`));
}

function tally_score(hand) {
    let score = 0;

    for (let i = 0; i < hand.length; i++) {
        score += get_card_value(hand[i]);
    }
    if (score > 21) {
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].includes("A+")) {
                hand[i] = hand[i].replace("A+", "A-");
                score -= 10;
                break;
            }
        }
    }
    return score;
}

function convert_suit_to_full_name(suit) {
    switch (suit) {
        case "S":
            return "spade";
        case "H":
            return "heart";
        case "D":
            return "diamond";
        case "C":
            return "club";
    }
}

function get_card_value(card) {
    let processed_card = card.substring(0, card.length - 1);
    let card_value = 0;
    if (processed_card == "J" || processed_card == "Q" || processed_card == "K") {
        card_value = 10;
    } else if (processed_card == "A+") {
        card_value = 11;
    } else if (processed_card == "A-") {
        card_value = 1;
    } else {
        card_value = parseInt(processed_card);
    }
    return card_value;
}

function choose_random_card(max) {
    return Math.floor(Math.random() * max);
}

function print_card(hand, hand_container) {
    hand_container.innerHTML = "";
    for (let i = 0; i < hand.length; i++) {
        let card_value = hand[i].substring(0, 1)
        let pip_amount = card_value
        if (card_value == "A" || card_value == "J" || card_value == "Q" || card_value == "K") {
            pip_amount = "1";
        } else if (card_value == "1") {
            pip_amount = "10"
            card_value = "10"
        };
        let card_suit = convert_suit_to_full_name(hand[i].substring(hand[i].length - 1, hand[i].length));

        let card = Ele.make("div", { class: "card" }, [
            Ele.make("div", { class: "corner-number top" }, card_value),
            Ele.make("div", { class: "corner-number bottom" }, card_value),

        ]);
        for (let j = 0; j < pip_amount; j++) {
            let pip = Ele.make("div", { class: "pip" }, "");
            card.appendChild(pip);
        }
        card.setAttribute("data-value", card_value);
        card.setAttribute("data-suit", card_suit);
        hand_container.appendChild(card);
    }
}

function deal_the_dealer (deck, dealer_hand, dealer_score, player_score) {
    let dealer_container = document.querySelector(".dealer__container");
    if (dealer_score < 17) {
        deal_card(deck, dealer_hand, "dealer_hand");
        dealer_score = 0;
        dealer_score += tally_score(dealer_hand);
        dealer_container.removeChild(dealer_container.lastChild);
        let dealer = Ele.make("div", { class: "dealer_score" }, `Dealer: ${dealer_score}`);
        dealer_container.appendChild(dealer);
        setTimeout(() => { 
            deal_the_dealer(deck, dealer_hand, dealer_score, player_score);
        }, 1000 );
    } else {
        show_end_game_message(player_score, dealer_score);
    }
}

function show_end_game_message(player_score, dealer_score) {
    let center_container = document.querySelector(".center__container");
    center_container.innerHTML = "";
    if (player_score == dealer_score) {
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Push!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        center_container.appendChild(center);
    } else if (dealer_score == 21){
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Dealer wins!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        center_container.appendChild(center);
    } else if (player_score == 21) {
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Black Jack!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        center_container.appendChild(center);
    } else if (dealer_score > 21) {
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Dealer bust!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        center_container.appendChild(center);
    } else if (player_score < dealer_score) {
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Dealer wins!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        center_container.appendChild(center);

    }else {
        let center = Ele.make("div", { class: "end_game_message" }, [
            Ele.make("span", {}, "Player wins!"),
            Ele.make("span", { class: "btn btn--stand", onclick: () => { new_game(); } }, "Try again")
        ]);
        center_container.appendChild(center);
    }
}

new_game();