import { Router } from 'express';
import { createPlaylist, updatePlaylistDetails, deletePlaylist, addVideoToPlaylist, removeVideoFromPlaylist, getUserPlaylist, getPlaylist } from '../controllers/playlist.js';
import verifyToken from '../middlewares/auth.js';

const router = Router();

router.route('/create').post(verifyToken, createPlaylist);

router.route('/update/:playlistId').patch(verifyToken, updatePlaylistDetails);

router.route('/delete/:playlistId').delete(verifyToken, deletePlaylist);

router.route('/addVideo/:playlistId').patch(verifyToken, addVideoToPlaylist);

router.route('/removeVideo/:playlistId').patch(verifyToken, removeVideoFromPlaylist);

router.route('/myPlaylist/').get(verifyToken, getUserPlaylist);

router.route('/:playlistId').get(getPlaylist);

export default router;
