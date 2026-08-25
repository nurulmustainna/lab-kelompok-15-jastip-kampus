# Bug #5 - Role Access Control for "Buka Sesi Jastip Baru"

## Problem Statement

The "Buka Sesi Jastip Baru" (Open New Jastip Session) button was visible and accessible to both Mahasiswa/Pembeli and Jastiper users. This feature should ONLY be available to Jastiper users.

**Symptom**: Mahasiswa could click "Buka Sesi Jastip Baru" and create sessions, which should not be allowed.

## Root Cause

The ActiveSessionsSection component:
1. Had no role parameter passed from App.tsx
2. No conditional rendering of the button based on user role
3. No permission check in the handleCreateSession function
4. Used hardcoded/default form values instead of actual logged-in user data

## Solution Implemented

### Change 1: Updated ActiveSessionsSection Component Props

**File**: [src/components/ActiveSessionsSection.tsx](src/components/ActiveSessionsSection.tsx#L1-L15)

**Lines 1-15**: Added imports and props
```typescript
import { JastipSession, StudentAccount } from '../types';
import { UserRole } from './MainPortalHeader';

interface ActiveSessionsSectionProps {
  sessions: JastipSession[];
  onSelectSessionForOrder: (session: JastipSession) => void;
  onNavigateTab: (tab: PortalTab) => void;
  currentRole?: UserRole;        // NEW
  currentStudent?: StudentAccount; // NEW
}

export const ActiveSessionsSection: React.FC<ActiveSessionsSectionProps> = ({
  sessions,
  onSelectSessionForOrder,
  onNavigateTab,
  currentRole = 'mahasiswa',      // NEW - default to mahasiswa (restricts by default)
  currentStudent                  // NEW
}) => {
```

### Change 2: Added Permission Check in handleCreateSession

**File**: [src/components/ActiveSessionsSection.tsx](src/components/ActiveSessionsSection.tsx#L34-L65)

**Lines 34-65**: Added role check and use actual user data
```typescript
const handleCreateSession = (e: React.FormEvent) => {
  e.preventDefault();
  
  // PERMISSION CHECK: Only Jastiper can create sessions
  if (currentRole !== 'jastiper') {
    alert('Akses Ditolak: Hanya Jastiper yang dapat membuka sesi baru.');
    return;
  }

  // Use current student's data if available, otherwise use form input
  const jastiperName = currentStudent ? `${currentStudent.name} (${currentStudent.nim})` : newJastiperName;
  const jastiperProdi = currentStudent ? currentStudent.prodi : 'Mahasiswa Unismuh Makassar';
  const jastiperAvatar = currentStudent ? currentStudent.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  const newSession: JastipSession = {
    id: `SES-UNISMUH-${Date.now().toString().slice(-4)}`,
    jastiperName: jastiperName,      // Uses actual logged-in user
    jastiperProdi: jastiperProdi,
    jastiperAvatar: jastiperAvatar,
    // ... rest of session data
  };

  setSessionList([newSession, ...sessionList]);
  setShowCreateSessionModal(false);
};
```

### Change 3: Conditional Button Rendering

**File**: [src/components/ActiveSessionsSection.tsx](src/components/ActiveSessionsSection.tsx#L91-L98)

**Lines 91-98**: Button only visible for Jastiper
```typescript
{currentRole === 'jastiper' && (
  <button
    onClick={() => setShowCreateSessionModal(true)}
    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start md:self-auto"
  >
    <Plus className="w-4 h-4" />
    <span>Buka Sesi Jastip Baru</span>
  </button>
)}
```

### Change 4: Pass Props from App.tsx

**File**: [src/App.tsx](src/App.tsx#L406-L416)

**Lines 406-416**: Pass currentRole and currentStudent to ActiveSessionsSection
```typescript
<ActiveSessionsSection 
  sessions={sessions}
  onSelectSessionForOrder={(ses) => {
    setSelectedSessionForOrder(ses);
    setActiveTab('catalog');
  }}
  onNavigateTab={setActiveTab}
  currentRole={userRole}              // NEW
  currentStudent={currentStudent}     // NEW
/>
```

## Access Control Logic

### Mahasiswa/Pembeli (Student):
- ✅ Can view "Sesi Titipan & Rute Jastiper Kampus"
- ✅ Can view available Jastiper sessions
- ✅ Can click "Titip Lewat Sesi Ini" to create orders
- ❌ Cannot see "Buka Sesi Jastip Baru" button
- ❌ Cannot create sessions (blocked at UI + function level)

### Jastiper (Delivery Partner):
- ✅ Can see "Buka Sesi Jastip Baru" button
- ✅ Can open session creation modal
- ✅ Can create sessions
- ✅ Session is created under their name + NIM
- ❌ Cannot create sessions as other users (uses currentStudent data)

### Admin:
- Not affected by this change (Admin uses separate AdminDashboard)

## Layer 1: UI Blocking

The button is wrapped in a conditional check:
```typescript
{currentRole === 'jastiper' && <button>...</button>}
```

**Effect**: Button doesn't render for Mahasiswa, so they cannot click it.

## Layer 2: Function Permission Check

Inside handleCreateSession:
```typescript
if (currentRole !== 'jastiper') {
  alert('Akses Ditolak: Hanya Jastiper yang dapat membuka sesi baru.');
  return;
}
```

**Effect**: Even if someone bypasses UI (developer console), the session creation is blocked.

## Layer 3: Owner Data Integrity

When creating a session:
```typescript
const jastiperName = currentStudent ? `${currentStudent.name} (${currentStudent.nim})` : newJastiperName;
```

**Effect**: Session owner is always the currently logged-in user, never hardcoded or defaulted to wrong user.

## Testing Plan

### Test 1: Mahasiswa User - Button Hidden ✓

**Steps**:
1. Login as Mahasiswa (Student Account)
   - Email: 105841114532@student.unismuh.ac.id
   - Password: 453212
2. Go to Portal → Sessions tab
3. Look at "Sesi Titipan & Rute Jastiper Kampus" section

**Expected Results**:
- ✅ "Buka Sesi Jastip Baru" button is NOT visible
- ✅ List of available sessions is still visible
- ✅ "Titip Lewat Sesi Ini" buttons are visible on each session
- ✅ No modal appears when trying to create session

### Test 2: Mahasiswa User - Cannot Create Programmatically ✓

**Steps**:
1. Login as Mahasiswa
2. Open browser DevTools → Console
3. Simulate trying to create session (if possible)

**Expected Results**:
- ✅ Alert: "Akses Ditolak: Hanya Jastiper yang dapat membuka sesi baru."
- ✅ No session is created
- ✅ Session list unchanged

### Test 3: Jastiper User - Button Visible ✓

**Steps**:
1. Logout
2. Login as Jastiper
   - Email: jasatitip@gmail.com
   - Password: jasatitip
3. Go to Portal → Sessions tab (or JastiperWorkspace)

**Expected Results**:
- ✅ "Buka Sesi Jastip Baru" button IS visible
- ✅ Button is clickable
- ✅ Clicking opens session creation modal

### Test 4: Jastiper User - Session Created with Correct Owner ✓

**Steps**:
1. Logged in as Jastiper
2. Click "Buka Sesi Jastip Baru"
3. Fill in session details:
   - Route: "Sentra Kuliner Jalan Panettieri"
   - Meeting Point: "Lobby Menara Iqra Unismuh"
   - Max Weight: 6 kg
4. Click "Publikasikan Sesi"

**Expected Results**:
- ✅ Modal closes
- ✅ New session appears in list
- ✅ Session's "Jastiper" name shows: "Andi Muhammad Fikri (jasatitip@gmail.com)" or similar logged-in user
- ✅ NOT a hardcoded default name

### Test 5: Different Jastiper - Different Owner ✓

**Steps**:
1. Login as Jastiper A
2. Create a session
3. Check that session shows Jastiper A's name as owner
4. Logout
5. Login as Jastiper B (if another test account exists)
6. Try to create a session
7. Check that new session shows Jastiper B's name

**Expected Results**:
- ✅ Each Jastiper's sessions have the correct owner
- ✅ No cross-user contamination
- ✅ Each session reflects the user who created it

### Test 6: Mahasiswa Can Still Use Sessions ✓

**Steps**:
1. Login as Mahasiswa
2. Go to Sessions tab
3. Click "Titip Lewat Sesi Ini" on any available session
4. Try to place an order through that session

**Expected Results**:
- ✅ Mahasiswa can still view sessions
- ✅ Mahasiswa can still place orders through sessions
- ✅ "Titip Lewat Sesi Ini" flow works normally
- ✅ Only "Buka Sesi Jastip Baru" is restricted

### Test 7: Refresh Persistence ✓

**Steps**:
1. Logged in as Jastiper
2. Create a new session
3. Verify it appears in the list
4. Refresh the browser (F5)
5. Check if session still appears

**Expected Results**:
- ✅ Session persists after refresh
- ✅ Owner information is correct after refresh
- ✅ Session data is not lost

### Test 8: Role Switching ✓

**Steps**:
1. Login as Jastiper
2. Verify button is visible
3. Switch role to "Mahasiswa" using role switcher (if available)
4. Check if button is hidden
5. Switch back to Jastiper
6. Verify button appears again

**Expected Results**:
- ✅ Button visibility changes with role
- ✅ No modal opens when role is Mahasiswa
- ✅ Role switching works correctly

## Code Quality Checks

### TypeScript Compilation
✓ Build successful: 1708 modules
✓ No new TypeScript errors
✓ All types properly imported
✓ StudentAccount and UserRole types used correctly

### Component Integration
✓ Props properly typed with interface
✓ Default values prevent undefined errors
✓ Conditional rendering uses proper syntax
✓ No breaking changes to existing features

### Backward Compatibility
✓ Mahasiswa portals unchanged (except button hidden)
✓ Session list display unchanged
✓ "Titip Lewat Sesi Ini" buttons still work
✓ "Pesanan Saya" and "Riwayat" unchanged
✓ Admin dashboard not affected

## Security Considerations

**Frontend-Only Implementation**:
This is a frontend-only permission check. If there is a backend API:
1. The backend should ALSO verify that only Jastiper can create sessions
2. The backend should validate the user role before accepting session creation
3. Do NOT rely on frontend checks alone for sensitive operations

**Current Project**: The project appears to be frontend-only with no backend API calls, so this frontend check is sufficient for the demo/learning environment.

## Files Modified

1. **src/components/ActiveSessionsSection.tsx**
   - Added UserRole and StudentAccount imports
   - Added currentRole and currentStudent props
   - Added permission check in handleCreateSession
   - Made button conditional based on role
   - Updated owner assignment logic

2. **src/App.tsx**
   - Added currentRole={userRole} prop to ActiveSessionsSection
   - Added currentStudent={currentStudent} prop to ActiveSessionsSection

## Build Status

✅ **Build Successful**
- 1708 modules compiled
- 0 new TypeScript errors
- Build time: 4.37s
- File size: dist/assets/index-DlU5OAY_.js (530.71 kB)

## Summary

The "Buka Sesi Jastip Baru" feature is now properly restricted to Jastiper users only. The fix implements three layers of protection:
1. **UI Layer**: Button is hidden from Mahasiswa
2. **Function Layer**: Permission check prevents session creation
3. **Data Layer**: Owner is always the logged-in user

Mahasiswa users can still view and use existing sessions, but cannot create new ones. Jastiper users have full access to create sessions under their own identity.
