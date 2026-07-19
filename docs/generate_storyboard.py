import sys

chapters = [
    ('CHƯƠNG 1: MỒI LỬA (THE SPARK)', 1, 16),
    ('CHƯƠNG 2: SÓNG NGẦM & SỰ CÔ LẬP (THE ESCALATION)', 17, 32),
    ('CHƯƠNG 3: BÓNG MA AI & TỐI HẬU THƯ (THE SCAM)', 33, 50),
    ('CHƯƠNG 4: NƯỚC MẮT & SỰ THỎA HIỆP (THE DECISION)', 51, 68),
    ('CHƯƠNG 5: PHÁN QUYẾT CUỐI CÙNG & CHỮA LÀNH (THE REPAIR)', 69, 80)
]

with open('D:/03-Startups-Products/unesco-youth-hackathon-2026/docs/pile_on_lab_missions_redesign.md', 'w', encoding='utf-8') as f:
    f.write('# ĐẶC TẢ SƠ ĐỒ 80 PHÂN CẢNH PHÂN NHÁNH (BRANCHING STORYBOARD)\n\n')
    f.write('**Dự án:** EchoShield Vietnam\n')
    f.write('**Thời lượng:** 80 phân cảnh x 1.5 phút/phân cảnh = 120 phút chơi game thực tế.\n')
    f.write('**Phong cách:** Genshin Impact (Hội thoại sâu sắc, NPC đa dạng, tương tác môi trường)\n')
    f.write('**Chỉ số:** Trust (Niềm tin của Vy), Stress (Áp lực nội tâm của Nam), Viral (Mức độ lan truyền tin đồn)\n\n')
    
    scene_id = 1
    for chap_title, start_sc, end_sc in chapters:
        f.write(f'## {chap_title}\n\n')
        for i in range(start_sc, end_sc + 1):
            bg = 'Hành lang trường học / Lớp học / Phòng ngủ'
            summary = 'Nhân vật giằng xé nội tâm trước áp lực từ bạn bè, gia đình, nhà trường và mạng xã hội.'
            
            if i < 10:
                bg = 'Lớp 11A, chiều muộn, ánh nắng hắt hiu quạnh quẽ.'
                summary = 'Vy bị phát hiện thiếu tiền quỹ. Các NPC học sinh xì xào bàn tán. Nam đứng giữa ranh giới can thiệp và im lặng.'
            elif i < 17:
                bg = 'Sân trường / Cổng trường. Nam trò chuyện với các học sinh lớp khác (như cơ chế NPC Genshin).'
                summary = 'Nam đi quanh trường thu thập manh mối, nghe tin đồn thất thiệt. Lời đe dọa nặc danh từ Confession xuất hiện.'
            elif i < 25:
                bg = 'Bàn ăn gia đình Nam / Phòng khách nhà Vy.'
                summary = 'Nam cãi nhau với bố mẹ vì bị cấm chơi với Vy do sợ ảnh hưởng thi đua. Bố Vy đánh Vy vì tin đồn.'
            elif i < 33:
                bg = 'Phòng Giáo viên. Cô Hương (CN) ép Nam phải cắt đứt với Vy để giữ ghế Chủ tịch CLB.'
                summary = 'Áp lực thành tích từ giáo viên. Cô Hương thể hiện sự vô cảm trước nỗi đau của học sinh, chỉ quan tâm thi đua lớp.'
            elif i < 40:
                bg = 'Nhóm chat Telegram hiển thị trên màn hình smartphone.'
                summary = 'Bức ảnh Deepfake khỏa thân của Vy xuất hiện. Admin tống tiền ép Vy gửi tiền hoặc làm bài tập.'
            elif i < 51:
                bg = 'Góc khuất sân sau trường học.'
                summary = 'Nam tìm cách giúp Vy đối phó với kẻ tống tiền. Cả hai đau khổ giằng xé khi không thể báo công an vì sợ lộ chuyện bố Vy bạo hành.'
            elif i < 60:
                bg = 'Phòng vệ sinh nữ / Sân thượng.'
                summary = 'Vy lên cơn hoảng loạn tột độ (Panic attack). Nam phải chọn tung ảnh gốc (lộ bí mật gia đình) hoặc dùng mã hóa AI (chậm trễ).'
            elif i < 69:
                bg = 'Hành lang tối / Cầu thang vắng.'
                summary = 'Sự tuyệt vọng leo thang. Vy có ý định nhảy lầu hoặc tự hại. Nam chạy đua với thời gian để ngăn cản.'
            elif i < 75:
                bg = 'Phòng Hội đồng kỷ luật.'
                summary = 'Cuộc đối chất cuối cùng với Minh, cô Hương và BGH. Nam đưa ra phán quyết vạch trần hay che giấu.'
            else:
                bg = 'Bệnh viện / Sân trường trong nắng mai.'
                summary = 'Kết cục của chuỗi quyết định. Hậu quả lên cuộc đời học sinh của Vy và sự dằn vặt của Nam.'

            chars = 'Nam (Mắt đỏ ngầu, toát mồ hôi), Vy (Ánh mắt trống rỗng, nước mắt lưng tròng), NPC Học sinh (Nhếch mép cười khinh)'
            d_char1 = 'Nam'
            d_line1 = 'Tớ không thể để cậu chịu đựng chuyện này một mình... Nhưng nếu thầy cô biết, họ sẽ tước học bổng của tớ...'
            d_char2 = 'Vy'
            d_line2 = 'Cậu mặc kệ tớ đi! Nếu bố tớ thấy cái ảnh kia, ông ấy sẽ đánh tớ chết mất! Đừng tỏ ra thương hại tớ nữa!'
            
            f.write(f'### Phân cảnh {i}: Bão ngầm tâm lý\n')
            f.write(f'* **ID:** SCENE_{i:03d}\n')
            f.write(f'* **Bối cảnh (BG):** {bg}\n')
            f.write(f'* **Sprite & Biểu cảm (Anime Style):** {chars}\n')
            f.write(f'* **Tóm tắt diễn biến kịch tính:** {summary}\n')
            f.write(f'* **Thoại rẽ nhánh tiêu biểu:**\n')
            f.write(f'  * **{d_char1}:** "{d_line1}"\n')
            f.write(f'  * **{d_char2}:** "{d_line2}"\n')
            f.write(f'  * *(Lựa chọn A)* Nắm lấy tay Vy, chống lại thế giới (Trust +20, Stress +30, Viral +15)\n')
            f.write(f'  * *(Lựa chọn B)* Quay mặt đi, tự bảo vệ mình (Trust -25, Stress -10, Viral +5)\n')
            f.write(f'* **Biến động chỉ số động:** Cập nhật liên tục tùy vào tương tác với NPC và lựa chọn hội thoại.\n\n')

