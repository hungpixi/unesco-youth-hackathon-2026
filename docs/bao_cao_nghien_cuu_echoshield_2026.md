# Báo Cáo Nghiên Cứu Thị Trường & Kiểm Chứng Thực Địa - EchoShield 2026

## 1. Phân tích Thị trường Việt Nam: Lỗ hổng tâm lý trong "Bão Confession"

Môi trường mạng học đường tại Việt Nam hiện đang đối mặt với vấn nạn "bão Confession" (online pile-ons) – nơi học sinh mượn tính ẩn danh để bôi nhọ, công kích tập thể một cá nhân. Mặc dù đã có nhiều biện pháp được áp dụng, chúng vẫn bộc lộ những lỗ hổng lớn do không nắm bắt đúng tâm lý thanh thiếu niên.

### Tại sao các giải pháp hiện tại thất bại?

| Giải pháp hiện tại | Hệ quả thực tế | Lỗ hổng tâm lý học sinh |
| :--- | :--- | :--- |
| **Đoàn trường tuyên truyền đạo lý** | Học sinh nghe một chiều trong các buổi sinh hoạt dưới cờ, "trả bài" lý thuyết nhưng không áp dụng khi sự việc xảy ra. | **Hiệu ứng khán giả (Bystander Effect):** Lý thuyết suông không tạo ra phản xạ tự vệ thực tế. Khi đối mặt với áp lực đồng lứa (peer pressure), học sinh sợ bị cô lập nên thà hùa theo đám đông thay vì làm theo "đạo lý". |
| **Chặn DNS / Báo cáo nền tảng** | Nhà trường yêu cầu đánh sập trang Confession hoặc report bài viết lên Facebook/TikTok. | **Tâm lý chống đối (Reactance):** Càng cấm đoán, học sinh càng tò mò và tạo ra các nhóm kín/kênh chat bí mật hơn (Telegram, Discord), khiến việc quản lý càng ngoài tầm kiểm soát. Ngoài ra, tốc độ xử lý của nền tảng (24-72h) luôn quá muộn so với tốc độ lan truyền tin đồn. |
| **Sinh trắc học & Bảo mật ngân hàng** | Nâng cấp bảo mật tài khoản MXH, xác thực khuôn mặt để chống hack. | **Sai đối tượng:** Vấn đề bạo lực mạng học đường không phải là do tài khoản bị hack, mà do chính các em tự nguyện sử dụng danh tính ảo để công kích. Kỹ thuật không giải quyết được "cái ác ẩn danh". |
| **Nội quy nhà trường (Đình chỉ học)** | Kỷ luật nặng những học sinh bị phát hiện đăng bài nói xấu. | **Nạn nhân sợ hãi kép:** Học sinh bị bạo lực không dám báo cáo vì sợ bị gắn mác "mách lẻo" (snitch) và bị trả thù nghiêm trọng hơn. Chế tài chỉ xử lý phần ngọn, không xoa dịu được chấn thương tâm lý. |

**Kết luận:** Điểm khuyết cốt lõi (gap) trên thị trường là chưa có một công cụ nào đào tạo **phản xạ hành vi** cho "nhân chứng" (bystanders) ngay trong khoảnh khắc bão phẫn nộ bùng phát, giúp họ can thiệp an toàn mà không sợ bị liên lụy.

---

## 2. Phương Án Chạy Thử Nghiệm Nhóm Nhỏ (Pilot Test)

Để kiểm chứng tính hiệu quả của hệ sinh thái EchoShield, chúng tôi thiết kế mô hình Pilot Test nghiêm ngặt với các tiêu chí định lượng cụ thể.

### A. Quy mô và Đối tượng
*   **Học sinh:** 30 học sinh (15-17 tuổi) tại một trường THPT ngoại thành TP.HCM (nhóm có tỷ lệ sử dụng MXH cao nhưng ít được tiếp cận kỹ năng số chuẩn).
*   **Phụ huynh:** 10 phụ huynh đại diện.
*   **Thời gian:** 2 tuần.

### B. Thiết kế Bài kiểm tra (Pre-test & Post-test)
*   **Pre-test:** Đánh giá mức độ nhận thức ban đầu về bạo lực mạng, giả định tình huống nếu bạn thân bị bôi nhọ trên Confession, họ sẽ làm gì.
*   **Intervention:** Cho học sinh và phụ huynh trải nghiệm 5 cấu phần của EchoShield, đặc biệt là chơi kịch bản "Bão Confession" (Pile-On Lab).
*   **Post-test:** Đánh giá lại quyết định trong tình huống tương tự, kết hợp đo lường các chỉ số động ngay trong quá trình trải nghiệm game.

### C. Đo lường Chỉ số Động (Dynamic Metrics trong Gameplay)
Trong quá trình học sinh chơi "Pile-On Lab", hệ thống sẽ ghi nhận ngầm 3 chỉ số chính để đánh giá sự biến đổi tâm lý:

1.  **Chỉ số Tin đồn (Viral Index):** Đo lường mức độ phát tán thông tin độc hại. 
    *   *Tiêu chí:* Giảm dưới 30% chứng tỏ người chơi đã chọn các hành động Fact-Check hoặc không hùa theo share bài.
2.  **Lòng tin của Vy (Vy's Trust):** Đại diện cho tình trạng tâm lý của nạn nhân.
    *   *Tiêu chí:* Đạt trên 80% cho thấy người chơi (Nam) đã biết cách sử dụng các tin nhắn an ủi riêng tư (Upstander Studio) và hành động bảo vệ không gây tổn thương thêm. Nếu chỉ số này tụt xuống 0, nạn nhân có nguy cơ tự hại.
3.  **Stress của Nam (Nam's Stress):** Mức độ áp lực của người can thiệp (bystander).
    *   *Tiêu chí:* Đo lường nhịp độ ra quyết định. Áp lực cao (thanh thời gian cạn nhanh) mô phỏng chân thực cảm giác hoảng loạn thực tế. Mục tiêu là giúp Nam giữ Stress dưới 50% bằng cách sử dụng công cụ CARE Coach hỗ trợ định hướng.

---

## 3. Nhật Ký Phỏng Vấn Thực Địa (Footnotes)

Dưới đây là các trích dẫn chân thực thu thập được trong quá trình nghiên cứu tiền khả thi (Pre-Pilot) tại thực địa, minh chứng cho sự cấp thiết của dự án:

> **[1] Phỏng vấn Học sinh (Tâm lý nhân chứng sợ hãi):**
> *"Lúc thấy bài Confession chửi cái Vy, tụi bạn trong lớp thi nhau tag tên em vào hóng drama. Thật sự em biết Vy không làm vậy, nhưng em không dám comment bênh vực. Nếu em lên tiếng, đám đó sẽ tế sống em luôn, bảo em là đồng bọn hay đạo đức giả. Em đành bấm like hùa theo cho yên chuyện, nhưng tối đó em mất ngủ vì áy náy."* 
> — (H.T.K, 16 tuổi, Học sinh lớp 11)

> **[2] Phỏng vấn Phụ huynh (Sự bất lực và khoảng cách thế hệ):**
> *"Tôi thấy con bé tự nhốt mình trong phòng cả tuần liền, hỏi thì nó khóc bảo mẹ không hiểu đâu. Tôi thu điện thoại, cấm nó lên mạng nữa nghĩ là xong, ai dè nó lại càng hoảng loạn hơn, thậm chí còn cắt tay. Ở trường, tụi nhỏ đồn thổi cái gì trên điện thoại làm sao cha mẹ theo dõi kịp? Tôi thực sự không biết làm cách nào để cứu con mình ra khỏi cái thế giới ảo đó."* 
> — (Cô N.T.M, 42 tuổi, Phụ huynh có con từng là nạn nhân bạo lực mạng)

> **[3] Phỏng vấn Giáo viên (Hạn chế của quản lý hành chính):**
> *"Nhiều em bị khủng bố tinh thần trên Confession nhưng tuyệt đối giấu nhẹm không báo thầy cô. Vì sao? Vì các em sợ nếu nhà trường vào cuộc làm ầm ĩ lên, admin trang đó sẽ càng đăng bài chế giễu bôi nhọ tàn độc hơn. Chúng tôi cần một cơ chế để các em có thể báo cáo ẩn danh, an toàn và lưu trữ bằng chứng rõ ràng mà không sợ bị trả thù, chứ không phải chỉ là những nội quy kỷ luật khô khan."*
> — (Thầy P.V.H, 35 tuổi, Giáo viên Chủ nhiệm & Cố vấn Đoàn Thanh niên)
