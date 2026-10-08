# Firebase Security Rules

## Firestore Security Rules

### Admin Email
- admin@travelwebsite.com

### Collection Access Rules

#### Users Collection (`/users/{userId}`)
- **Read**: Only if authenticated AND requesting user's own document
- **Write**: Only if authenticated AND requesting user's own document
- **Purpose**: Users can only read/write their own profile data

#### Tours Collection (`/tours/{tourId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view tours, only admin can manage tours

#### Hotels Collection (`/hotels/{hotelId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view hotels, only admin can manage hotels

#### Visa Services Collection (`/visaServices/{serviceId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view visa services, only admin can manage

#### Visa Applications Collection (`/visaApplications/{applicationId}`)
- **Read**: Owner OR Admin
- **Create**: Authenticated users
- **Update**: Admin only
- **Delete**: Admin only
- **Purpose**: Users can create applications, can only read their own, admin manages all

#### Hajj Packages Collection (`/hajjPackages/{packageId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view packages, only admin can manage

#### Umrah Packages Collection (`/umrahPackages/{packageId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view packages, only admin can manage

#### Bookings Collection (`/bookings/{bookingId}`)
- **Read**: Owner OR Admin
- **Create**: Authenticated users
- **Update**: Admin only
- **Delete**: Admin only
- **Purpose**: Users can create bookings, can only read their own, admin manages all

#### Wishlists Collection (`/wishlists/{wishlistId}`)
- **Read**: Owner OR Admin
- **Create**: Authenticated users
- **Update**: Owner only
- **Delete**: Owner OR Admin
- **Purpose**: Users can manage their own wishlist, admin can view all

#### Contact Messages Collection (`/contactMessages/{messageId}`)
- **Read**: Admin only
- **Create**: Public (anyone can submit)
- **Update**: Admin only
- **Delete**: Admin only
- **Purpose**: Public can submit contact forms, only admin can manage

#### Reviews Collection (`/reviews/{reviewId}`)
- **Read**: Public (anyone can read)
- **Create**: Authenticated users
- **Update**: Owner only
- **Delete**: Owner OR Admin
- **Purpose**: Users can manage their own reviews

#### Coupons Collection (`/coupons/{couponId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view coupons, only admin can manage

#### Notifications Collection (`/notifications/{notificationId}`)
- **Read**: Owner only
- **Write**: Admin only
- **Purpose**: Users can read their notifications, admin can send

#### Settings Collection (`/settings/{settingId}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view settings, only admin can manage

## Storage Security Rules

### Access Rules

#### Tour Images (`/tours/{tourId}/{allPaths=**}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view tour images, only admin can upload

#### Hotel Images (`/hotels/{hotelId}/{allPaths=**}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view hotel images, only admin can upload

#### Destination Images (`/destinations/{destinationId}/{allPaths=**}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view destination images, only admin can upload

#### User Profile Images (`/users/{userId}/{allPaths=**}`)
- **Read**: Public (anyone can read)
- **Write**: Owner only
- **Purpose**: Users can upload their own profile images

#### Visa Documents (`/visa-documents/{applicationId}/{allPaths=**}`)
- **Read**: Admin only
- **Write**: Admin only
- **Purpose**: Admin manages all visa documents for security

#### Hajj/Umrah Images (`/hajj-umrah/{packageId}/{allPaths=**}`)
- **Read**: Public (anyone can read)
- **Write**: Admin only
- **Purpose**: Public can view package images, only admin can upload

## Security Summary

### User Access
- ✅ Can read own bookings
- ✅ Can read own visa applications
- ✅ Can read own wishlist
- ✅ Can read own profile
- ✅ Can read own notifications
- ✅ Can create bookings
- ✅ Can create visa applications
- ✅ Can manage own wishlist
- ✅ Can upload own profile image
- ❌ Cannot read other users' bookings
- ❌ Cannot read other users' applications
- ❌ Cannot read other users' wishlist
- ❌ Cannot manage tours/hotels/visa services
- ❌ Cannot manage visa documents

### Admin Access
- ✅ Can read all bookings
- ✅ Can read all visa applications
- ✅ Can read all wishlists
- ✅ Can read all contact messages
- ✅ Can update booking status
- ✅ Can update visa application status
- ✅ Can create/update/delete tours
- ✅ Can create/update/delete hotels
- ✅ Can create/update/delete visa services
- ✅ Can create/update/delete hajj/umrah packages
- ✅ Can manage coupons
- ✅ Can manage settings
- ✅ Can send notifications
- ✅ Can manage visa documents

### Public Access
- ✅ Can read tours
- ✅ Can read hotels
- ✅ Can read visa services
- ✅ Can read hajj/umrah packages
- ✅ Can read reviews
- ✅ Can read coupons
- ✅ Can read settings
- ✅ Can read all images
- ✅ Can submit contact forms
