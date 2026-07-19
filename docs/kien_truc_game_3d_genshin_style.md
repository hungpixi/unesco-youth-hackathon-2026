# KIẾN TRÚC THẾ GIỚI 3D TRÊN WEB PHONG CÁCH GENSHIN IMPACT
*Dự án: EchoShield Vietnam*
*Phương châm: Trải nghiệm 3D nhập vai hoạt hình (Cel-shaded) mượt mà không cần cài đặt*

---

Để tái hiện lại trải nghiệm nhập vai 3D thế giới mở sống động giống như **Genshin Impact** ngay trên trình duyệt web di động (Zalo/Facebook Webview) mà không bắt người dùng cài đặt ứng dụng nặng hàng chục GB, EchoShield thiết lập kiến trúc kỹ thuật **Web3D Cel-Shaded Engine** tối ưu theo các trụ cột sau:

```
+-------------------------------------------------------------------+
|                        ECHOSHIELD GAME CLIENT                     |
|  +--------------------+  +------------------+  +---------------+  |
|  | R3F Render (WebGL2)|  | Rapier WASM Phys |  | Spatial Audio |  |
|  |  * Cel/Toon Shader |  |  * Collisions    |  |  * HRTF 3D    |  |
|  |  * Outline Shader  |  |  * Movement      |  |  * Sound Env  |  |
|  +--------------------+  +------------------+  +---------------+  |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        INFRASTRUCTURE LAYER                       |
|  +--------------------+  +------------------+  +---------------+  |
|  | Draco Asset Stream |  | Cloudflare DO    |  | Dexie Save DB |  |
|  |  * GLTF Chunking   |  |  * WebSocket Sync|  |  * IndexedDB  |  |
|  +--------------------+  +------------------+  +---------------+  |
+-------------------------------------------------------------------+
```

---

## I. CÁC TRỤ CỘT KIẾN TRÚC KỸ THUẬT 3D

### 1. Rendering Pipeline: Toon/Cel-Shading Shader (Đồ họa hoạt hình 3D Anime)
*   **Bản chất:** Genshin Impact nổi tiếng với phong cách đồ họa hoạt hình Cel-shaded 3D. Trên Web, chúng ta không dùng đổ bóng thực tế (Realistic Shading) vì gây nặng GPU di động, mà viết custom **GLSL Shaders** tích hợp vào **Three.js/React Three Fiber**:
    *   **Banded Lighting Shader (Đổ bóng phân dải):** Thay vì chuyển sắc độ bóng mượt từ sáng sang tối, shader này chia mức độ ánh sáng trên mô hình 3D thành 2-3 dải màu sắc nét (Hard-edged shadows) để tạo cảm giác anime vẽ tay 2D.
    *   **Outline Effect Shader (Vẽ nét viền nhân vật):** Sử dụng kỹ thuật *Inverted Hull* trong Vertex Shader (nhân rộng mô hình nhân vật lên một chút, đảo ngược mặt polygon và tô màu đen) để vẽ đường viền nét thanh nét đậm xung quanh Nam, Vy, Minh và bàn ghế.
    *   **Specular Highlight (Phản xạ tóc & Mắt phát sáng):** Viết Fragment Shader tùy chỉnh để vùng highlight trên tóc nhân vật luôn giữ hình dáng lấp lánh đặc trưng khi camera di chuyển, và mắt nhân vật có chiều sâu anime.

### 2. Asset Streaming: Draco Nén & Phân Vùng Bản Đồ (World Chunking & LOD)
Để giảm dung lượng game từ mức khổng lồ xuống dưới **3MB tải lần đầu**, EchoShield áp dụng chiến lược tối ưu hóa tài nguyên thế giới mở:
*   **Draco GLTF Compression:** Toàn bộ mô hình 3D trường học THPT và nhân vật được nén bằng thư viện Google Draco, giảm dung lượng file `.glb` xuống 85% (từ 15MB xuống dưới 2MB).
*   **Spatial Partitioning (Phân vùng không gian bằng Octree):** Bản đồ trường học được chia nhỏ thành các "chunk" không gian 10m x 10m. Khi nhân vật Nam đi đến đâu, game engine chỉ stream và load tài nguyên 3D của các chunk lân cận. Các chunk ở xa sẽ bị giải phóng khỏi RAM trình duyệt để tránh tràn bộ nhớ trên điện thoại RAM 2GB.
*   **LOD (Level of Detail):** Bàn học, bảng đen, tủ locker ở xa camera sẽ được tự động thay thế bằng phiên bản đa giác cực thấp (Low-poly) hoặc ảnh phẳng 2D (Billboarding), giúp tốc độ khung hình luôn đạt **60 FPS ổn định** trên Safari/Chrome của điện thoại cũ.

### 3. Engine Vật Lý: WebAssembly Rapier.js (Va chạm 3D hiệu năng cao)
*   **Bản chất:** Thay vì sử dụng các engine vật lý nặng nề chạy bằng JavaScript thuần dễ gây giật lag (như Cannon.js), EchoShield nhúng **Rapier.js** biên dịch trực tiếp sang **WebAssembly (WASM)**.
*   **Tính năng:** Rapier WASM chịu trách nhiệm tính toán trọng lực, chuyển động trượt mượt mà của Nam trên mặt đất khi bấm WASD, và phát hiện va chạm hộp (AABB Collisions) xung quanh Vy, Minh và các bức tường. Do chạy bằng mã máy WASM, hiệu năng xử lý vật lý nhanh gấp 10 lần JS thông thường, giảm tối đa mức độ nóng máy và hao pin của điện thoại.

### 4. Hệ Thống Âm Thanh Không Gian (Spatial Audio via Web Audio API)
*   **Bản chất:** Genshin Impact có âm thanh môi trường cực kỳ chân thực. EchoShield mô phỏng điều này trên Web bằng cách sử dụng **PannerNode** của **Web Audio API**:
    *   **HRTF (Head-Related Transfer Function):** Tái tạo âm thanh lập thể 3D định hướng theo vị trí camera và nhân vật Nam.
    *   **Trải nghiệm thực tế:** Khi Nam đi lại gần nhóm học sinh đang xì xào bàn tán về Vy ở cuối lớp, tiếng thì thầm to dần ở tai bên trái/phải tương ứng với hướng đứng của họ. Khi đi ra xa hoặc đi qua bức tường, âm thanh tự động bị suy hao và lọc tần số thấp (low-pass filter) giống như âm thanh bị cản ngoài đời thực.

### 5. Multiplayer Co-op (Đồng hành lá chắn số thời gian thực)
*   **Bản chất:** Hỗ trợ sảnh chờ multiplayer ẩn danh giữa các học sinh trong trường:
    *   Sử dụng **WebSockets** kết nối đến **Cloudflare Workers + Durable Objects** (máy chủ proxy biên siêu nhẹ, độ trễ cực thấp < 10ms).
    *   Học sinh khi online sẽ nhìn thấy vị trí 3D của nhau di chuyển dưới dạng các tinh linh "Khiên nhỏ - Shieldy" bay lơ lửng xung quanh hành lang lớp học.
    *   Các em có thể cùng nhau tham gia giải đố Fact-check, tương tác với các tủ đồ để tìm manh mối thẻ nhớ bác bảo vệ và cùng chia sẻ chứng cứ thu thập được (E2EE) vào Vault tập thể để đối chất trước BGH.
