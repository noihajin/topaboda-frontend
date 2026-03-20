/**
 * modalConfigs.jsx
 * TopaModal에 펼쳐서 사용하는 프리셋 모음
 *
 * 사용법:
 *   import { MODAL } from "@/constants/modalConfigs";
 *   <TopaModal {...MODAL.SIGNUP_SUCCESS} isOpen={isOpen} onClose={close} onConfirm={() => navigate("/login")} />
 */

/* ════════════════════════════════════════════
   1. 인증 / 계정 (Auth & User)
════════════════════════════════════════════ */

/** 회원가입 완료 → 로그인 페이지 유도 */
export const SIGNUP_SUCCESS = {
  variant: "success",
  icon: "🎉",
  title: "会員登録が完了しました！",
  children: (
    <>
      톺아보다へようこそ！<br />
      ログインしてコンテンツをお楽しみください。
    </>
  ),
  confirmLabel: "ログインへ",
  singleButton: true,
};

/** 닉네임/아이디 이미 사용 중 */
export const DUPLICATE_NICKNAME = {
  variant: "danger",
  icon: "⚠️",
  title: "すでに使用中のニックネームです",
  children: "他のニックネームを入力してください。",
  singleButton: true,
  confirmLabel: "확인",
};

export const DUPLICATE_ID = {
  variant: "danger",
  icon: "⚠️",
  title: "すでに使用中のIDです",
  children: "別のIDを入力してください。",
  singleButton: true,
  confirmLabel: "확인",
};

/** 닉네임/아이디 사용 가능 */
export const AVAILABLE_NICKNAME = {
  variant: "success",
  icon: "✅",
  title: "使用可能なニックネームです",
  children: "このニックネームは使用できます。",
  singleButton: true,
  confirmLabel: "확인",
};

export const AVAILABLE_ID = {
  variant: "success",
  icon: "✅",
  title: "使用可能なIDです",
  children: "このIDは使用できます。",
  singleButton: true,
  confirmLabel: "확인",
};

/** 이메일 인증 코드 발송 완료 */
export const EMAIL_SENT = {
  variant: "info",
  icon: "📧",
  title: "認証コードを送信しました",
  children: (
    <>
      ご登録のメールアドレスに<br />
      認証コードをお送りしました。<br />
      <span style={{ fontSize: 13, color: "#6b7280" }}>
        ※ 有効期限は5分間です
      </span>
    </>
  ),
  singleButton: true,
  confirmLabel: "확인",
};

/** 이메일 인증 실패 */
export const EMAIL_VERIFY_FAIL = {
  variant: "danger",
  icon: "❌",
  title: "認証コードが正しくありません",
  children: "入力した認証コードを確認してください。",
  singleButton: true,
  confirmLabel: "再確認",
};

/** 회원 탈퇴 최종 확인 */
export const DELETE_ACCOUNT = {
  variant: "danger",
  icon: "🗑️",
  title: "本当に退会しますか？",
  children: (
    <>
      退会すると、すべてのデータが<strong>完全に削除</strong>され、<br />
      復元することができません。
    </>
  ),
  confirmLabel: "退会する",
  cancelLabel: "キャンセル",
};

/* ════════════════════════════════════════════
   2. 탐방 경로 (Direction)
════════════════════════════════════════════ */

/** 루트 저장 완료 */
export const ROUTE_SAVE_SUCCESS = {
  variant: "success",
  icon: "🗺️",
  title: "ルートを保存しました",
  children: "マイページの「保存したルート」から確認できます。",
  singleButton: true,
  confirmLabel: "확인",
};

/** 루트 삭제 확인 */
export const ROUTE_DELETE_CONFIRM = {
  variant: "danger",
  icon: "🗑️",
  title: "このルートを削除しますか？",
  children: "削除したルートは復元できません。",
  confirmLabel: "削除する",
  cancelLabel: "キャンセル",
};

/* ════════════════════════════════════════════
   3. 커뮤니티 / 리뷰 (Board & Review)
════════════════════════════════════════════ */

/** 게시글 삭제 확인 */
export const POST_DELETE_CONFIRM = {
  variant: "danger",
  icon: "🗑️",
  title: "この投稿を削除しますか？",
  children: "削除した投稿は復元できません。",
  confirmLabel: "削除する",
  cancelLabel: "キャンセル",
};

/** 리뷰 삭제 확인 */
export const REVIEW_DELETE_CONFIRM = {
  variant: "danger",
  icon: "🗑️",
  title: "このレビューを削除しますか？",
  children: "削除したレビューは復元できません。",
  confirmLabel: "削除する",
  cancelLabel: "キャンセル",
};

/** 이미지 업로드 오류 - 용량 초과 */
export const IMAGE_SIZE_ERROR = {
  variant: "danger",
  icon: "📁",
  title: "ファイルサイズが大きすぎます",
  children: "アップロードできるファイルは5MB以下です。\n別のファイルを選択してください。",
  singleButton: true,
  confirmLabel: "확인",
};

/** 이미지 업로드 오류 - 형식 오류 */
export const IMAGE_FORMAT_ERROR = {
  variant: "danger",
  icon: "🖼️",
  title: "対応していないファイル形式です",
  children: "JPG・PNG・WEBP形式のみアップロード可能です。",
  singleButton: true,
  confirmLabel: "확인",
};

/** 리뷰 작성 완료 */
export const REVIEW_SUCCESS = {
  variant: "success",
  icon: "⭐",
  title: "レビューを投稿しました",
  children: "文化遺産の記録にご協力いただきありがとうございます。",
  singleButton: true,
  confirmLabel: "확인",
};

/** 로그인 필요 안내 */
export const LOGIN_REQUIRED = {
  variant: "info",
  icon: "🔐",
  title: "ログインが必要です",
  children: "この機能を利用するにはログインしてください。",
  confirmLabel: "ログインへ",
  cancelLabel: "キャンセル",
};

/* ════════════════════════════════════════════
   4. 업적 / 보상 (Achievement)
════════════════════════════════════════════ */

/** 업적 달성 축하 - 금 */
export const ACHIEVEMENT_GOLD = {
  variant: "success",
  icon: "🥇",
  title: "金メダル業績達成！",
  children: (
    <>
      おめでとうございます！<br />
      <strong style={{ color: "#CACA00", fontSize: 17 }}>金メダル</strong>の業績を獲得しました。<br />
      <span style={{ fontSize: 13, color: "#6b7280" }}>業績ページで確認できます。</span>
    </>
  ),
  singleButton: true,
  confirmLabel: "업적 확인",
};

/** 업적 달성 축하 - 은 */
export const ACHIEVEMENT_SILVER = {
  variant: "info",
  icon: "🥈",
  title: "銀メダル業績達成！",
  children: (
    <>
      おめでとうございます！<br />
      <strong style={{ color: "#a0aec0", fontSize: 17 }}>銀メダル</strong>の業績を獲得しました。
    </>
  ),
  singleButton: true,
  confirmLabel: "업적 확인",
};

/** 업적 달성 축하 - 동 */
export const ACHIEVEMENT_BRONZE = {
  variant: "info",
  icon: "🥉",
  title: "銅メダル業績達成！",
  children: (
    <>
      おめでとうございます！<br />
      <strong style={{ color: "#cd7f32", fontSize: 17 }}>銅メダル</strong>の業績を獲得しました。
    </>
  ),
  singleButton: true,
  confirmLabel: "업적 확인",
};

/* ── 네임드 exports 묶음 (선택 import 편의용) ── */
export const MODAL = {
  // Auth
  SIGNUP_SUCCESS,
  DUPLICATE_NICKNAME,
  DUPLICATE_ID,
  AVAILABLE_NICKNAME,
  AVAILABLE_ID,
  EMAIL_SENT,
  EMAIL_VERIFY_FAIL,
  DELETE_ACCOUNT,
  LOGIN_REQUIRED,
  // Direction
  ROUTE_SAVE_SUCCESS,
  ROUTE_DELETE_CONFIRM,
  // Community / Review
  POST_DELETE_CONFIRM,
  REVIEW_DELETE_CONFIRM,
  IMAGE_SIZE_ERROR,
  IMAGE_FORMAT_ERROR,
  REVIEW_SUCCESS,
  // Achievement
  ACHIEVEMENT_GOLD,
  ACHIEVEMENT_SILVER,
  ACHIEVEMENT_BRONZE,
};
