import { Ele } from "./utilities/element.js"; 
const PLAYER = document.querySelector("#blackjack__player");
const DEALER = document.querySelector("#blackjack__dealer");
const CENTER = document.querySelector("#blackjack__center");

function new_game() {
    // Reset the game
    PLAYER.removeChild;
    DEALER.removeChild;
    CENTER.removeChild;
    // Setting up the deck
    var deck_dealer_first = [
        "8H", "9H", "10H", "JH", "QH", "KH", // Hearts
        "8D", "9D", "10D", "JD", "QD", "KD", // Diamonds
        "8S", "9S", "10S", "JS", "QS", "KS", // Spades
        "8C", "9C", "10C", "JC", "QC", "KC"  // Clubs
    ];
    var deck_dealer_last = [
         "7H", "AH", // Hearts
         "7D", "AD", // Diamonds
         "7S", "AS", // Spades
         "7C", "AC"  // Clubs
    ]
    var deck_finalized = [
        "2H", "3H", "4H", "5H", "6H", // Hearts
        "2D", "3D", "4D", "5D", "6D", // Diamonds
        "2S", "3S", "4S", "5S", "6S", // Spades
        "2C", "3C", "4C", "5C", "6C", // Clubs
    ];
    
    // Setting up the players
    var dealer_hand = [];
    var dealer_score = 0;
    
    var player_hand = [];
    var player_score = 0;

    // Starting the game
    
    // Deal the dealer 2 cards
    deal_to_dealer(deck_dealer_first, deck_dealer_last, dealer_hand);
    deal_to_dealer(deck_dealer_last, deck_finalized, dealer_hand);
    dealer_score += tally_score(dealer_hand);
    
    // Deal the player 2 cards
    deal_to_player(deck_finalized, player_hand);
    deal_to_player(deck_finalized, player_hand);
    player_score += tally_score(player_hand);
    
    // Setting up the board
    // Dealer
    let dealer = Ele.make("div", {}, `${dealer_score}`);
    DEALER.appendChild(dealer);

    // Center
    if (player_score == 21) {
        let center = Ele.make("div", {}, "Blackjack!");
        CENTER.appendChild(center);
    } else{
        let center = Ele.make("div", {}, [
            Ele.make("span", {onclick: () => {
                deal_to_player(deck_finalized, player_hand);
                player_score = 0;
                player_score += tally_score(player_hand);

                PLAYER.removeChild(PLAYER.lastChild);
                let player = Ele.make("div", {}, `${player_score}`);
                PLAYER.appendChild(player);

                if (player_score == 21) {
                    CENTER.removeChild(CENTER.lastChild);
                    let center = Ele.make("div", {}, "Blackjack!");
                    CENTER.appendChild(center);
                }else if (player_score > 21) {
                    CENTER.removeChild(CENTER.lastChild);
                    let center = Ele.make("div", {}, "Bust!");
                    CENTER.appendChild(center);
                }

            }}, "Hit"),
            Ele.make("span", {}, " or "),
            Ele.make("span", {onclick: () => {
                if (player_score == dealer_score) {
                    CENTER.removeChild(CENTER.lastChild);
                    let center = Ele.make("div", {}, "Push!");
                    CENTER.appendChild(center);
                } else if (player_score < dealer_score) {
                    CENTER.removeChild(CENTER.lastChild);
                    let center = Ele.make("div", {}, "Dealer wins!");
                    CENTER.appendChild(center);
                } else{
                    CENTER.removeChild(CENTER.lastChild);
                    let center = Ele.make("div", {}, "Player wins!");
                    CENTER.appendChild(center);
                }
            }}, "Stand")

        ]);
        CENTER.appendChild(center);
    }

    // Player
    let player = Ele.make("div", {}, `${player_score}`);
    PLAYER.appendChild(player);

}



function deal_to_dealer(deck, new_deck, dealer_hand) {
    let random_card = choose_random_card(deck.length);
    dealer_hand.push(deck[random_card]);
    deck.splice(random_card, 1);
    for (let i = 0; i < deck.length; i++) {
        new_deck.push(deck[i]);
    }
}
function deal_to_player(deck, player_hand) {
    let random_card = choose_random_card(deck.length);
    player_hand.push(deck[random_card]);
    deck.splice(random_card, 1);
}



function tally_score(hand) {
    let score = 0;
    for (let i = 0; i < hand.length; i++) {
        score += get_card_value(hand[i]);
    }
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