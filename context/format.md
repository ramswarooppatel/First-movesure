
### 📖 Breakdown:

| Position | Length | Description |
|----------|--------|-------------|
| 1–2      | 2      | **State Code** – Numeric code of the Indian state where the entity is registered |
| 3–12     | 10     | **PAN Number** of the entity (Permanent Account Number) |
| 13       | 1      | **Entity Code** – Represents the number of registrations under the same PAN in a state (1–9, A–Z) |
| 14       | 1      | **Default Alphabet** – Currently always **"Z"** (reserved for future use) |
| 15       | 1      | **Checksum Character** – Auto-generated character for error detection |

---

## 📍 State Codes Used in GSTIN

| Code | State / Union Territory              |
|------|--------------------------------------|
| 01   | Jammu & Kashmir                      |
| 02   | Himachal Pradesh                     |
| 03   | Punjab                               |
| 04   | Chandigarh                           |
| 05   | Uttarakhand                          |
| 06   | Haryana                              |
| 07   | Delhi                                |
| 08   | Rajasthan                            |
| 09   | Uttar Pradesh                        |
| 10   | Bihar                                |
| 11   | Sikkim                               |
| 12   | Arunachal Pradesh                    |
| 13   | Nagaland                             |
| 14   | Manipur                              |
| 15   | Mizoram                              |
| 16   | Tripura                              |
| 17   | Meghalaya                            |
| 18   | Assam                                |
| 19   | West Bengal                          |
| 20   | Jharkhand                            |
| 21   | Odisha                               |
| 22   | Chhattisgarh                         |
| 23   | Madhya Pradesh                       |
| 24   | Gujarat                              |
| 25   | Daman and Diu                        |
| 26   | Dadra and Nagar Haveli               |
| 27   | Maharashtra                          |
| 28   | Andhra Pradesh (Old)                 |
| 29   | Karnataka                            |
| 30   | Goa                                  |
| 31   | Lakshadweep                          |
| 32   | Kerala                               |
| 33   | Tamil Nadu                           |
| 34   | Puducherry                           |
| 35   | Andaman and Nicobar Islands         |
| 36   | Telangana                            |
| 37   | Andhra Pradesh (New)                |
| 97   | Other Territory                      |

---

### 🧪 GSTIN Example:
```text
27ABCDE1234F1Z5


# PAN Format 
ABCDE1234F


### 📖 Format Breakdown:

| Position | Length | Description |
|----------|--------|-------------|
| 1–3      | 3      | **Random Alphabetic Letters** – Uniquely generated |
| 4        | 1      | **Entity Type Code** (explained below) |
| 5        | 1      | **First Letter** of surname (for individuals) or entity name |
| 6–9      | 4      | **Sequential Number** – Numeric (0001 to 9999) |
| 10       | 1      | **Alphabetic Check Digit** – Ensures correctness |

---

## 🔠 4th Character – PAN Holder Type

| Code | Entity Type                        |
|------|------------------------------------|
| **P** | Individual                         |
| **C** | Company                            |
| **H** | Hindu Undivided Family (HUF)       |
| **A** | Association of Persons (AOP)       |
| **B** | Body of Individuals (BOI)          |
| **G** | Government                         |
| **J** | Artificial Juridical Person        |
| **L** | Local Authority                    |
| **F** | Firm / Partnership                 |
| **T** | Trust                              |

---

## 🧪 PAN Examples

| PAN Number   | Description                                 |
|--------------|---------------------------------------------|
| `ASDPK1234F` | Individual with surname starting with K      |
| `AAACB1234M` | Company whose name starts with B             |
| `AAAAA9999A` | Dummy PAN used for documentation/testing     |

---

## 🧠 Important Notes

- PAN is **permanent** and **unique** for each taxpayer.
- PAN is required for:
  - Filing income tax returns
  - Opening bank accounts
  - High-value transactions
- A person/entity can **have only one PAN** under Indian law.

---

## 🧪 Regex Pattern (Validation)

You can validate PAN using the following regex:

^[A-Z]{5}[0-9]{4}[A-Z]{1}$


- First 5: Alphabets  
- Next 4: Numbers  
- Last 1: Alphabet

---
