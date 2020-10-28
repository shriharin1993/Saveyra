<?php $query = new WP_Query( 'post_type=cpo_feature&posts_per_page=-1&order=ASC&orderby=menu_order' ); ?>
<?php
if ( $query->posts ) :
	$feature_count = 0;
?>
<div id="features" class="features">
	<div class="container">		
		<?php cpotheme_block( 'home_features', 'features-heading section-heading' ); ?>
		<?php cpotheme_grid( $query->posts, 'element', 'feature', 3 ); ?>
	</div>
	<div style="text-align:center">
		<a class="button button-medium" href="http://localhost/saveyra/index.php/contact-us/">Enquire now</a>
	</div>
</div>
<?php endif; ?>

