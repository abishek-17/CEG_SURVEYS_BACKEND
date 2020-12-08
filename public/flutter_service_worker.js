'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "6fd292092923a04a10f06be72aee290e",
"assets/assets/icons/a.png": "ea703a4553f4f30c2f2a7af3dd919f78",
"assets/assets/icons/ans%2520sruvey%2520icon.png": "f9ac59aac5e4b68f301409cfc44cbae5",
"assets/assets/icons/b.png": "70de2d10772b59deed941a167c87e39d",
"assets/assets/icons/bell.png": "fd2db910ad409923f5fc286022bf6039",
"assets/assets/icons/bell_o.png": "2d29ee703c1f9e96bccc0eabb9d329bd",
"assets/assets/icons/bell_o.svg": "e64001e7787865726e22e79a8f63c57c",
"assets/assets/icons/bell_s.svg": "91e26a07f44b7e819e935bc2f658e6a6",
"assets/assets/icons/button.png": "0450595aa005904623c9c2b4874f70cc",
"assets/assets/icons/create%2520surey%2520icon.png": "7a7f07d88bef250883504e45ee373cb9",
"assets/assets/icons/email%2520icon.png": "c512135026db3822cd434958f3f6edda",
"assets/assets/icons/gear_o.svg": "981e4fc8517235338e34ecf6c7633d31",
"assets/assets/icons/gear_s.svg": "5999c23bde28337ec6c0cf489cc3dd31",
"assets/assets/icons/help%2520icon.png": "8d3510b3e5a2c036ed6e80445ddda1f5",
"assets/assets/icons/home.png": "e6bd1d6505835c062ee213cdfda7e661",
"assets/assets/icons/home_o.svg": "6f087f95ffc4946f72d8d4e7513ca13e",
"assets/assets/icons/home_s.svg": "e7e642fe44d31da99ffce283c442c4db",
"assets/assets/icons/in%2520icon.png": "42dfdc098d6299b0b0a5731b32461337",
"assets/assets/icons/login%2520and%2520register%2520icons.png": "ee089f100035652108d2ce643904560e",
"assets/assets/icons/logo.png": "e54dc3f6d9a2a45b6975f3511ba72d6e",
"assets/assets/icons/name%2520icon.png": "a2f639de5f434e5727c0067b882e3186",
"assets/assets/icons/nav.png": "36faadbce689b483c4630ef91f2ff351",
"assets/assets/icons/notification_icon.png": "c7e5e33b5debd4bb743cc4ebc9de04dd",
"assets/assets/icons/notification_icon1.png": "2d3d4f6524cbddd7c771cf27690ca8ed",
"assets/assets/icons/password%2520icon.png": "037b38ce9da2d26a538bdad93081e6c0",
"assets/assets/icons/radio%2520button%2520icon.png": "ea5e2e4b3c64246dd3f193619d0a057d",
"assets/assets/icons/search.png": "f6a2d8532271ecaf16b71d6a318fe54c",
"assets/assets/icons/search_s.svg": "a7a5c7fd569fb8e871443e2c3748a1c8",
"assets/assets/icons/settings.png": "a6910623e600c34387da6e1972386dbc",
"assets/assets/icons/settings_o.png": "023d2ab009c76da6a8a287f0f6507b57",
"assets/assets/icons/survey%2520logo.png": "e38aab3b8951a45c68c858b2f9f4e2b5",
"assets/assets/icons/username%2520icon.png": "df90e65884759c5f7e092f3f8978808f",
"assets/assets/icons/view%2520my%2520response%2520icon.png": "ee1f0fef4bfa2d2ff22c96dc92dea11f",
"assets/assets/icons/view%2520my%2520survey%2520icon.png": "5f5e2162270e0cea5a5db160f995cdd6",
"assets/assets/images/me.jpg": "613bd12a76dc6be01a8d43c6ac2cd8f3",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/NOTICES": "db6aebadf118d71dda2331e3dff86511",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "a6d89a4c95bd22c6d09b0b45e30d905c",
"/": "a6d89a4c95bd22c6d09b0b45e30d905c",
"main.dart.js": "c32512b403260ceb0397add9bce73ddf",
"manifest.json": "e9132b3799295967df26a9c1add0b950"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
