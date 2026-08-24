# Test Guide: Completed Orders Flow (Phase 2)

## Overview
This document provides step-by-step test cases to verify the completed orders flow implementation.

## Setup
Before testing, ensure:
- ✓ Build completed successfully: `npm run build`
- ✓ No TypeScript errors
- ✓ Browser DevTools console is open (to check for errors)
- ✓ localStorage is enabled in browser

## Test Scenarios

### Test 1: Buyer Creates Order
**Goal:** Verify basic order creation still works

**Steps:**
1. Login as Mahasiswa (e.g., Rifka Nur, NIM: 123456)
2. Go to Catalog tab
3. Add items to cart
4. Click "Buat Pesanan"
5. Fill order form and submit

**Expected Result:**
- ✓ Order created with status: MENUNGGU_PEMBAYARAN
- ✓ Order appears in "Pesanan Saya" tab
- ✓ Status badge shows "Pesanan Aktif Anda"

---

### Test 2: Buyer Pays for Order
**Goal:** Verify order transitions to ESCROW status

**Steps:**
1. In "Pesanan Saya" tab, view order from Test 1
2. Click "Bayar Sekarang via QRIS"
3. Click "Simulasikan Pembayaran Berhasil" in modal
4. Confirm payment

**Expected Result:**
- ✓ Order status changes to ESCROW_DITAMPUNG
- ✓ "Jastiper Belanja di Warung" button appears
- ✓ No "Hapus Pesanan" button (order not yet completed)

---

### Test 3: Jastiper Completes Order
**Goal:** Verify Jastiper can complete order and order status becomes SELESAI

**Steps:**
1. Login as Jastiper (e.g., Andi Muhammad Fikri)
2. Go to Jastiper Workspace tab
3. Find the order from Test 1 in the list (should show ESCROW status)
4. Click "Selesaikan Order" or complete all simulation steps
5. Verify order reaches SELESAI_DITERIMA status

**Expected Result:**
- ✓ Order status becomes SELESAI_DITERIMA
- ✓ Order moves to COMPLETED tab in Jastiper Workspace
- ✓ Order persists in system (check localStorage: jastip_orders)

---

### Test 4: Buyer Sees Completed Order
**Goal:** Verify buyer can see completed order in "Pesanan Saya"

**Steps:**
1. Logout as Jastiper
2. Login as original buyer (Rifka Nur, NIM: 123456)
3. Go to "Pesanan Saya" tab

**Expected Result:**
- ✓ Order from Test 1 is still visible
- ✓ Status badge shows "Pesanan Selesai" (green)
- ✓ "Hapus Pesanan" button appears (red with trash icon)
- ✓ "Lihat Live Map Tracking" button is hidden for completed order

---

### Test 5: Completed Order Persists After Refresh
**Goal:** Verify order status and display persist after page refresh

**Steps:**
1. With order in SELESAI status, press F5 or Ctrl+R to refresh
2. Login again if needed
3. Go to "Pesanan Saya" tab

**Expected Result:**
- ✓ Order still shows with SELESAI status
- ✓ "Hapus Pesanan" button still visible
- ✓ No "Lihat Live Map Tracking" button

---

### Test 6: Buyer Deletes Completed Order
**Goal:** Verify buyer can hide completed order

**Steps:**
1. View the completed order (Test 4)
2. Click "Hapus Pesanan" button
3. Wait for toast message

**Expected Result:**
- ✓ Toast shows: "Pesanan #[CODE] telah dihapus dari daftar Pesanan Saya."
- ✓ Order details disappear from view
- ✓ Message shows: "Pesanan Telah Dihapus" with alert icon
- ✓ Message explains: "Anda bisa membuat pesanan baru"

---

### Test 7: Deletion Persists After Refresh
**Goal:** Verify deleted order stays hidden after page refresh

**Steps:**
1. After Test 6 (order deleted), press F5 to refresh page
2. Login again if needed
3. Go to "Pesanan Saya" tab

**Expected Result:**
- ✓ Order does NOT reappear
- ✓ "Pesanan Telah Dihapus" message still shows
- ✓ Check localStorage: jastip_deleted_orders contains the order ID

**LocalStorage Check (DevTools):**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('jastip_deleted_orders'))
// Should show: { "123456": ["[order.id]"] }
```

---

### Test 8: Buyer Can Create New Order After Deletion
**Goal:** Verify deletion doesn't prevent creating new orders

**Steps:**
1. After Test 7 (old order deleted, page refreshed)
2. Go to Catalog tab
3. Add items to cart
4. Click "Buat Pesanan"
5. Fill form and submit

**Expected Result:**
- ✓ New order created successfully
- ✓ New order appears in "Pesanan Saya" with MENUNGGU_PEMBAYARAN status
- ✓ Deletion of old order doesn't interfere
- ✓ "Pesanan Aktif Anda" badge shows for new order

---

### Test 9: Multiple Students Keep Orders Separate
**Goal:** Verify orders from different buyers don't interfere

**Steps:**
1. Create and complete order as Buyer A (Rifka Nur, NIM: 123456)
2. Delete order as Buyer A
3. Login as Buyer B (different student)
4. Verify Buyer B's orders are not affected

**Expected Result:**
- ✓ Buyer B doesn't see Buyer A's deleted order
- ✓ Buyer B can see their own active orders
- ✓ Deletions are per-student (tracked by NIM)

**LocalStorage Check:**
```javascript
// Each student should have own entry:
JSON.parse(localStorage.getItem('jastip_deleted_orders'))
// { "123456": [...], "654321": [...] }
```

---

### Test 10: Order Not Deleted from System
**Goal:** Verify deleted order still exists in global system (just hidden from buyer)

**Steps:**
1. After deleting order as Buyer A
2. Login as Admin
3. Check Admin Dashboard

**Expected Result:**
- ✓ Admin still sees buyer's orders (they're not deleted globally)
- ✓ Order data persists in localStorage: jastip_orders
- ✓ Only hidden from that buyer's "Pesanan Saya" view

---

## Regression Tests (Verify Existing Functionality)

### Regression 1: Login Still Works
- ✓ Can login as Mahasiswa
- ✓ Can login as Jastiper
- ✓ Can login as Admin

### Regression 2: Register Still Works
- ✓ New user registration completes
- ✓ Error messages display correctly
- ✓ New user appears in Admin Dashboard

### Regression 3: Admin Dashboard Works
- ✓ Shows all registered users
- ✓ No errors in console

### Regression 4: Jastiper Workspace Works
- ✓ Shows correct Jastiper name (not hardcoded)
- ✓ Can filter by tabs (ALL, PENDING, IN PROGRESS, COMPLETED)
- ✓ COMPLETED count accurate

### Regression 5: Payment Simulation Works
- ✓ QRIS modal appears
- ✓ Payment simulation button works
- ✓ Order advances to ESCROW status

### Regression 6: Live Tracking Works
- ✓ For active orders, "Lihat Live Map Tracking" button works
- ✓ Tracking tab shows live location data

---

## Data to Check After Tests

### localStorage Locations:
```javascript
// 1. User accounts
JSON.parse(localStorage.getItem('jastip_users'))
// Result: Array of StudentAccount

// 2. All orders
JSON.parse(localStorage.getItem('jastip_orders'))
// Result: Record<nim, JastipOrder>

// 3. Deleted order IDs per student
JSON.parse(localStorage.getItem('jastip_deleted_orders'))
// Result: Record<nim, string[]> with order IDs
```

### Verify After Each Test:
1. Check localStorage for proper format
2. Check browser console for errors
3. Verify toast messages appear
4. Confirm UI state matches expectations

---

## Expected Build Output
```
✓ 1708 modules transformed
✓ built in ~3-4s
✓ NO ERRORS
✓ NO TYPESCRIPT ERRORS
```

---

## Cleanup After Testing
```bash
# If you need to reset test data:
# Open DevTools Console and run:
localStorage.removeItem('jastip_deleted_orders')
localStorage.removeItem('jastip_orders')
localStorage.removeItem('jastip_users')
# Then refresh page
```

---

## Sign-off Checklist

After completing all tests, verify:

- [ ] Test 1: Create Order - PASSED
- [ ] Test 2: Pay for Order - PASSED
- [ ] Test 3: Jastiper Completes - PASSED
- [ ] Test 4: Buyer Sees Completed - PASSED
- [ ] Test 5: Refresh Persists Status - PASSED
- [ ] Test 6: Delete Order Works - PASSED
- [ ] Test 7: Delete Persists - PASSED
- [ ] Test 8: New Order After Delete - PASSED
- [ ] Test 9: Multiple Students Separate - PASSED
- [ ] Test 10: Not Deleted Globally - PASSED
- [ ] Regression 1: Login Works - PASSED
- [ ] Regression 2: Register Works - PASSED
- [ ] Regression 3: Admin Works - PASSED
- [ ] Regression 4: Jastiper Workspace Works - PASSED
- [ ] Regression 5: Payment Works - PASSED
- [ ] Regression 6: Tracking Works - PASSED
- [ ] Build: No Errors - PASSED
- [ ] Console: No Errors - PASSED

---

## Notes

### Implementation Details
- Order deletion is done per-student basis (tracked by NIM)
- Deleted orders are NOT removed from system globally
- Delete state is persisted to localStorage: 'jastip_deleted_orders'
- Format: Record<nim, Set<orderId>> serialized as Record<nim, string[]>
- Delete handler in App.tsx: handleDeleteOrder(orderId)
- Delete UI in MyOrdersSection.tsx with Trash2 icon

### Files Modified
1. **src/App.tsx**
   - Added deletedOrderIds state (line 80)
   - Added handleDeleteOrder function (line 250)
   - Added isOrderDeletedByBuyer checker (line 263)
   - Pass handlers to MyOrdersSection (line 422-423)

2. **src/components/MyOrdersSection.tsx**
   - Added Trash2 icon import (line 4)
   - Added props for delete handlers (line 15-16)
   - Added deleted order message UI (line 85-98)
   - Wrapped content to hide if deleted (line 100)
   - Updated status badge for completed orders (line 115-119)
   - Added "Hapus Pesanan" button (line 122-130)
   - Conditional tracking button (line 131-139)
   - Hidden simulation for completed (line 271)

### No Breaking Changes
- All existing functionality preserved
- Backward compatible
- No new dependencies added
- Uses existing Lucide React icons
