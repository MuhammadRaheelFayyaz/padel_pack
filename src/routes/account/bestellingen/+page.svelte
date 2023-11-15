<script>
	const orders = [
		{
			orderNumber: '0002',
			orderDate: '1 april 2023',
			products: [
				{
					product: 'Performance Pack',
					amount: 1
				}
			],
			totalPrice: 11.48,
			status: 'Verzonden',
			invoice: 'file'
		},
		{
			orderNumber: '0004',
			orderDate: '1 juni 2023',
			products: [
				{
					product: 'Starter Pack',
					amount: 2
				},
				{
					product: 'Performance Pack',
					amount: 1
				}
			],
			totalPrice: 23.48,
			status: 'Verzonden',
			invoice: 'file'
		},
		{
			orderNumber: '0005',
			orderDate: '1 juli 2023',
			products: [
				{
					product: 'Starter Pack',
					amount: 1
				},
				{
					product: 'Performance Pack',
					amount: 1
				}
			],
			totalPrice: 23.48,
			status: 'Afgeleverd',
			invoice: 'file'
		},
		{
			orderNumber: '0005',
			orderDate: '1 juli 2023',
			products: [
				{
					product: 'Starter Pack',
					amount: 2
				},
				{
					product: 'Starter Pack',
					amount: 2
				},
				{
					product: 'Champion Pack',
					amount: 3
				}
			],
			totalPrice: 23.48,
			status: 'In behandeling',
			invoice: 'file'
		}
	];
</script>

<div class="hidden md:block w-full overflow-auto">
	<table class="w-full">
		<thead>
			<tr>
				<th>Bestelnummer</th>
				<th>Besteldatum</th>
				<th>Product(en)</th>
				<th>Totaal</th>
				<th>Status</th>
				<th>Factuur</th>
			</tr>
		</thead>
		<tbody>
			{#if orders}
				{#each orders as history, index}
					<!-- {@const products = history.products}
					<tr>
						<td>{history.orderNumber}</td>
						<td>{history.orderDate}</td>
						<td>
							<ul class="flex flex-col flex-wrap gap-1 max-w-xs">
								{#each products as product}
									<li
										class="bg-theme-dark-blue/50 px-2 py-1 rounded-full w-fit mt-px text-xs text-white whitespace-nowrap"
									>
										{product.amount}x - {product.product}
									</li>
								{/each}
							</ul>
						</td>
						<td>
							{history.price}
						</td>
						<td>
							{history.status}
						</td>
						<td>
							<a href="/" class="underline">download</a>
						</td>
					</tr> -->
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<div class="flex flex-col gap-6 md:hidden">
	{#if orders}
		{#each orders as history}
			{@const products = history.products}

			<div class="border rounded-md pl-8 py-6 pr-4">
				<table class="order-history">
					<tr>
						<td>Besteldatum</td>
						<td>{history.orderDate}</td>
					</tr>
					<tr>
						<td>Bestelnummer</td>
						<td>{history.orderNumber}</td>
					</tr>
					<tr>
						<td>Product(en)</td>
						<td>
							<ul>
								{#each products as product}
									<li>
										{product.amount}x -
										{product.product}
									</li>
								{/each}
							</ul>
						</td>
					</tr>

					<tr>
						<td>Totaalprijs</td>
						<td>{history.totalPrice}</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>{history.status}</td>
					</tr>
					<tr>
						<td>Factuur</td>
						<td>
							{history.invoice}
							<a href="/" class="underline">Download</a>
						</td>
					</tr>
				</table>
			</div>
		{/each}
	{/if}
</div>
