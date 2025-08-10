;; Simple NFT Collection - SIP-009 Standard Implementation
;; Workshop Version: Basic but compliant

;; Implement SIP-009 NFT trait
(impl-trait .nft-trait.nft-trait)

;; Define the NFT
(define-non-fungible-token nft-ijazah uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Data variables
(define-data-var last-token-id uint u0)
(define-data-var base-token-uri (string-ascii 256) "https://workshop.blockdev.id/nft/")

;; Data maps for metadata
(define-map token-metadata uint 
  {
    name: (string-ascii 64),
    description: (string-ascii 256),
    image: (string-ascii 256)
  }
)

;; SIP-009 required functions
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-map token-uris uint (string-utf8 256))

(define-read-only (get-token-uri (token-id uint))
  (ok (map-get? token-uris token-id))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? nft-ijazah token-id))
)

;; Transfer function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (nft-transfer? nft-ijazah token-id sender recipient)
  )
)

;; Mint function (owner only)
(define-public (mint (to principal) (name (string-ascii 64)) (description (string-ascii 256)) (image (string-ascii 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    
    ;; Mint NFT
    (try! (nft-mint? nft-ijazah token-id to))
    
    ;; Store metadata
    (map-set token-metadata token-id {
      name: name,
      description: description,
      image: image
    })
    
    ;; Update last token ID
    (var-set last-token-id token-id)
    
    (ok token-id)
  )
)

;; Get token metadata
(define-read-only (get-token-metadata (token-id uint))
  (map-get? token-metadata token-id)
)

;; Set base URI (owner only)
(define-public (set-base-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set base-token-uri new-uri))
  )
)